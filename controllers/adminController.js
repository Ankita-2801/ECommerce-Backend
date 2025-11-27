import mongoose from 'mongoose';
import { getAdminModel } from '../models/Admin.js';
import { getUserModel } from '../models/User.js';
import { getProductModel } from '../models/Product.js';
import { getOrderModel } from '../models/Order.js';
import { sendBulkEmail } from '../utils/emailService.js';
// GET /admin/profile
export const getAdminProfile = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.user._id) {
      return res.status(400).json({ message: 'Missing user ID' });
    }
    const Admin = await getAdminModel();
    const admin = await Admin.findById(req.user._id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (err) {
    console.error("Error in getAdminProfile:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /admin/users
export const getAllUsers = async (req, res) => {
  try {
    const Admin = await getAdminModel();
    const User = await getUserModel();

    const admins = await Admin.find().select('username email phone role');
    const users = await User.find().select('username email phone role');
    const allUsers = [...admins, ...users];
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// GET /admin/users/:id OR /admin/users?email=user@gmail.com
export const getUserDetails = async (req, res) => {
  try {
    const Admin = await getAdminModel();
    const User = await getUserModel();
    const Order = await getOrderModel(); 

    const { email } = req.query;
    let account = null;

    if (email) {
     
      account =
        (await User.findOne({ email }).select('username email phone role address')) ||
        (await Admin.findOne({ email }).select('username email phone role address'));
    } else if (req.params.id) {
     
      account =
        (await User.findById(req.params.id).select('username email phone role address')) ||
        (await Admin.findById(req.params.id).select('username email phone role address'));
    }

    if (!account) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const orders = await Order.find({ 'user.email': account.email })
      .sort({ createdAt: -1 })
      .select('_id products cartTotal payment orderStatus createdAt');

  
    console.log("Account email:", account.email);
    console.log("Orders found:", orders.length);
    console.log("Orders:", orders);

    res.status(200).json({ user: account, orders });
  } catch (err) {
    console.error('Error in getUserDetails:', err);
    res.status(500).json({
      message: 'Failed to fetch user details',
      error: err.message,
    });
  }
};

// GET /admin/metrics (For Card.jsx)
export const getDashboardMetrics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const Admin = await getAdminModel();
    const User = await getUserModel();
    const Product = await getProductModel();
    const Order = await getOrderModel();

    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

  const revenueAgg = await Order.aggregate([
  {
    $match: {
      $or: [
        // Include UPI payments that are completed
        {
          'payment.method': 'UPI',
          'payment.status': 'Completed'
        },
        // Include COD payments only if order is delivered
        {
          'payment.method': 'Cash on Delivery',
          'orderStatus': 'Delivered'
        }
      ]
    }
  },
  {
    $project: {
      orderRevenue: {
        $sum: {
          $map: {
            input: '$products',
            as: 'item',
            in: {
              $multiply: [
                {
                  $subtract: [
                    { $add: ['$$item.price', '$$item.gst'] },
                    '$$item.discount'
                  ]
                },
                '$$item.quantity'
              ]
            }
          }
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      total: { $sum: '$orderRevenue' }
    }
  }
]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const salesTrend = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          dailyTotal: { $sum: '$cartTotal' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    const chartData = salesTrend.map(day => day.dailyTotal);

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalOrders,
      totalProducts,
      totalRevenue,
      chartData
    });
  } catch (err) {
    console.error("Error in getDashboardMetrics:", err);
    res.status(500).json({ message: 'Failed to fetch metrics', error: err.message });
  }
};

//chart
export const getSalesChartData = async (req, res) => {
  try {
    const Order = await getOrderModel();

    const monthlyData = await Order.aggregate([
      {
        $match: {
          $or: [
            { 'payment.method': 'UPI', 'payment.status': 'Completed' },
            { 'payment.method': 'Cash on Delivery', 'orderStatus': 'Delivered' }
          ]
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          revenue: {
            $sum: {
              $map: {
                input: "$products",
                as: "item",
                in: {
                  $multiply: [
                    {
                      $subtract: [
                        { $add: ["$$item.price", "$$item.gst"] },
                        "$$item.discount"
                      ]
                    },
                    "$$item.quantity"
                  ]
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$month",
          sales: { $sum: 1 },
          revenue: { $sum: "$revenue" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = monthlyData.map(item => ({
      name: monthNames[item._id - 1],
      sales: item.sales,
      revenue: item.revenue
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error in getSalesChartData:", err);
    res.status(500).json({ message: "Failed to fetch chart data", error: err.message });
  }
};

// NEW FUNCTION: Global Search for Admin Dashboard
export const globalAdminSearch = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { q } = req.query; 
        if (!q || q.length < 2) {
            return res.status(200).json({ users: [], products: [], orders: [], pages: [] });
        }

        const searchTerm = new RegExp(q, 'i'); // Case-insensitive regex search
        const Product = await getProductModel();
        const User = await getUserModel();
        const Admin = await getAdminModel();
        const Order = await getOrderModel();

        // User Search (Customer Name, Email, Phone) 
        const userResults = await User.find({
            $or: [
                { username: searchTerm },
                { email: searchTerm },
                { phone: searchTerm }
            ]
        }).select('username email phone role');

       
        const allUsers = userResults.map(u => ({
            ...u.toObject(),
            type: u.role,
            link: `/admin/users/${u._id}`
        }));

        // Product Search (Product Name, Category, Low Stock) 
        const productSearchCriteria = [
            { name: searchTerm },
            { category: searchTerm },
        ];
        // Add low stock condition only if the query suggests it
        if (q.toLowerCase().includes('low stock')) {
             productSearchCriteria.push({ stock: { $lt: 10 } }); 
        }
        
        const productResults = await Product.find({
            $or: productSearchCriteria
        }).select('name category stock price');

        const formattedProducts = productResults.map(p => ({
            ...p.toObject(),
            type: 'product',
            link: `/admin/products/${p._id}`
        }));

        //Order Search (Order ID, Customer Name, Status, Product Name in Order) 
        const isValidObjectId = mongoose.Types.ObjectId.isValid(q);
const objectIdQuery = isValidObjectId ? new mongoose.Types.ObjectId(q) : null;


        const orderResults = await Order.aggregate([
            // Join with User/Customer collection
            {
                $lookup: {
                    from: User.collection.name, 
                    localField: 'user', 
                    foreignField: '_id', 
                    as: 'customerDetails'
                }
            },
            { $unwind: { path: '$customerDetails', preserveNullAndEmptyArrays: true } },

            //  Filter Orders based on query across multiple fields
            {
                $match: {
                    $or: [
                        // Search by Order ID
                       ...(objectIdQuery ? [{ _id: objectIdQuery }] : []),
                        // Search by Order Status
                        { orderStatus: searchTerm }, 
                        // Search by Customer Name
                        { 'customerDetails.username': searchTerm }, 
                        // Search by Product Name in Items array (Crucial for deep search)
                        { 'items.name': searchTerm },
                    ]
                }
            },
            // Select relevant fields for the response
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    customerName: '$customerDetails.username',
                    customerEmail: '$customerDetails.email'
                }
            }
        ]);

        const formattedOrders = orderResults.map(o => ({
            ...o, // use 'o' directly as it's a plain object from aggregation
            customerName: o.customerName || 'N/A',
            type: 'order',
            link: `/admin/orders/${o._id}`
        }));
        res.status(200).json({
            users: allUsers,
            products: formattedProducts,
            orders: formattedOrders,
        });

    } catch (err) {
        console.error("Error in globalAdminSearch:", err);
        res.status(500).json({ message: 'Failed to perform search', error: err.message });
    }
};
//SEND email to all registered customer 
export const bulkOfferSend=async(req,res)=>{
  const { subject, body } = req.body;
  
      if (!subject || !body) {
          return res.status(400).json({ message: 'Subject and body are required.' });
      }
  
      try {
          const result = await sendBulkEmail(subject, body);
          
          if (result.totalRecipients === 0) {
               return res.status(404).json({ message: result.message });
          }
  
          res.status(200).json({ 
              message: `Bulk email process started. Successfully sent ${result.successfulSends} out of ${result.totalRecipients} emails.`,
              details: result,
              status: 'queued'
          });
  
      } catch (error) {
          console.error("API Error sending bulk email:", error);
          res.status(500).json({ 
              message: 'An internal server error occurred while initiating the campaign.', 
              error: error.message 
          });
      }
}