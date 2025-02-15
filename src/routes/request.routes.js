import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createRequest, createRequestReport, deactiveRequest, fulfillRequest, getRequestById, getUserRequests } from "../controllers/request.controller.js";

const router = Router();

router.route("/create-request").post(verifyJwt, createRequest);
router.route("/request-report").post(verifyJwt, createRequestReport);
router.route("/user-requests").get(verifyJwt, getUserRequests);
router.route("/get-request").get(getRequestById);
router.route("/fulfill-request/:requestId").get(verifyJwt, fulfillRequest);
router.route("/deactive-request/:requestId").get(verifyJwt, deactiveRequest);

export default router;