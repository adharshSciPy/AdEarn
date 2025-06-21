// checkOtp.js
import redis from "./redisClient.js"; // adjust if needed

const phoneNumber = "9567951490";

async function checkOtp() {
  try {
    const key = `otp:${phoneNumber}`;
    const otpValue = await redis.get(key);

    if (otpValue) {
      console.log(`✅ OTP found in Redis for ${phoneNumber}:`, otpValue);
    } else {
      console.log(`❌ No OTP found for ${phoneNumber}, or it expired.`);
    }

    process.exit(0); // Exit cleanly
  } catch (error) {
    console.error("Error checking Redis:", error);
    process.exit(1);
  }
}

checkOtp();
