import Router from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updatePassword, updatePhoneNumber, updateUser, updateUserDetails } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(verifyJwt, refreshAccessToken);

router.route("/update-number").patch(verifyJwt, updatePhoneNumber);
router.route("/update-details").patch(verifyJwt, updateUserDetails);
router.route("/update-password").patch(verifyJwt, updatePassword);
router.route("/update-user").patch(verifyJwt, updateUser);
router.route("/update-avatar").patch(verifyJwt, upload.single('avatar'), updateAvatar);

export default router;