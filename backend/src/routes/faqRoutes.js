const express = require("express");
const router = express.Router();
const {
  getAllFaq, getFaqById, createFaq,
  updateFaq, deleteFaq, toggleActiveFaq,
} = require("../controllers/faqController");
const { faqValidator } = require("../validators/faqValidator");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/auth");
const { mutateLimiter } = require("../middlewares/rateLimiter");

// ✅ Public
router.get("/", getAllFaq);
router.get("/:id", getFaqById);

// 🔒 Protected + Rate Limited
router.post("/", authenticate, mutateLimiter, faqValidator, validateRequest, createFaq);
router.put("/:id", authenticate, mutateLimiter, faqValidator, validateRequest, updateFaq);
router.patch("/:id/toggle-active", authenticate, mutateLimiter, toggleActiveFaq);
router.delete("/:id", authenticate, mutateLimiter, deleteFaq);

module.exports = router;
