const User = require("../models/User");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const Download = require("../models/Download");

exports.getAdminReports = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const isDBConnected = mongoose.connection.readyState === 1;

    if (!isDBConnected) {
      return res.json({
        success: true,
        overview: {
          totalUsers: 0,
          totalRevenue: 0,
          paidUsers: 0,
          activeSubscriptions: 0,
          totalPayments: 0,
          successfulPayments: 0,
          failedPayments: 0,
          totalDownloads: 0,
        },
        monthlyRevenue: [],
        popularPlans: [],
      });
    }

    const UserSession = require("../models/UserSession");

    const [
      sessions,
      downloads,
      paidPayments,
      allPayments,
      activeSubscriptions,
      usersCount
    ] = await Promise.all([
      UserSession.find().lean().catch(() => []),
      Download.find().lean().catch(() => []),
      Payment.find({ status: "paid" }).lean().catch(() => []),
      Payment.find().lean().catch(() => []),
      Subscription.countDocuments({ status: "active", endDate: { $gt: new Date() } }).catch(() => 0),
      User.countDocuments().catch(() => 0)
    ]);

    // Unique user count from sessions & downloads
    const uniqueUserKeys = new Set(
      sessions.map((s) => s.email || s.guestId || s.sessionId).filter(Boolean)
    );
    downloads.forEach((d) => {
      if (d.email || d.guestId || d.sessionId) {
        uniqueUserKeys.add(d.email || d.guestId || d.sessionId);
      }
    });
    const totalUsers = Math.max(uniqueUserKeys.size, usersCount);

    // Total Downloads & Transactions
    const totalDownloads = downloads.length;
    const totalPayments = Math.max(downloads.length, allPayments.length);
    const successfulPayments = Math.max(downloads.length, paidPayments.length);
    const failedPayments = allPayments.filter((p) => p.status === "failed").length;

    // Revenue calculation
    const downloadRevenue = downloads.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0
    );
    const paymentRevenue = paidPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    const totalRevenue = downloadRevenue > 0 ? downloadRevenue : paymentRevenue;

    // Paid users
    const paidUsersSet = new Set();
    downloads.forEach((d) => {
      if (d.email || d.guestId || d.sessionId) paidUsersSet.add(d.email || d.guestId || d.sessionId);
    });
    paidPayments.forEach((p) => {
      if (p.userId || p.email) paidUsersSet.add(p.userId?.toString() || p.email);
    });
    const paidUsers = paidUsersSet.size;

    // Monthly revenue
    const monthMap = {};
    const revenueItems = downloads.length > 0 ? downloads : paidPayments;
    revenueItems.forEach((item) => {
      const dateVal = item.downloadedAt || item.createdAt;
      if (dateVal) {
        const d = new Date(dateVal);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
          if (!monthMap[key]) {
            monthMap[key] = {
              _id: { year: d.getFullYear(), month: d.getMonth() + 1 },
              revenue: 0
            };
          }
          monthMap[key].revenue += Number(item.amount || 0);
        }
      }
    });
    const monthlyRevenue = Object.values(monthMap).sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });

    // Popular Plans
    const planMap = {};
    if (downloads.length > 0) {
      downloads.forEach((d) => {
        const planName =
          d.downloadType === "watermarked"
            ? "With Watermark (₹99)"
            : d.downloadType === "no_watermark"
            ? "Without Watermark (₹199)"
            : d.downloadType || "Standard Resume";
        if (!planMap[planName]) {
          planMap[planName] = { _id: planName, purchases: 0, revenue: 0 };
        }
        planMap[planName].purchases += 1;
        planMap[planName].revenue += Number(d.amount || 0);
      });
    } else {
      paidPayments.forEach((p) => {
        const planName = p.plan || p.planId || "Standard Plan";
        if (!planMap[planName]) {
          planMap[planName] = { _id: planName, purchases: 0, revenue: 0 };
        }
        planMap[planName].purchases += 1;
        planMap[planName].revenue += Number(p.amount || 0);
      });
    }
    const popularPlans = Object.values(planMap)
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5);

    return res.json({
      success: true,
      overview: {
        totalUsers,
        totalRevenue,
        paidUsers,
        activeSubscriptions,
        totalPayments,
        successfulPayments,
        failedPayments,
        totalDownloads,
      },
      monthlyRevenue,
      popularPlans,
    });
  } catch (error) {
    console.error("Admin reports error:", error);
    return res.status(200).json({
      success: true,
      overview: {
        totalUsers: 0,
        totalRevenue: 0,
        paidUsers: 0,
        activeSubscriptions: 0,
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        totalDownloads: 0,
      },
      monthlyRevenue: [],
      popularPlans: [],
    });
  }
};
