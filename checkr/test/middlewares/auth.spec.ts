import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import httpStatus from "http-status";
import isAuth from "../../src/common/middlewares/auth";
import CustomError from "../../src/common/interfaces/custom-error";
import { User } from "../../src/models/user";
import { AUTH_SECRET } from "../../src/common/constants/global";
import { ErrorMessages } from "../../src/common/constants/messages";

describe("isAuth middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: SinonStub;

    beforeEach(() => {
        req = {
            get: sinon.stub().callsFake((name: string) => {
                // You can add logic here if needed
                return undefined; // Return default value for the stub
            }), body: {} };
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    it("should call next with error if no authorization header", async () => {
        await isAuth(req as Request, res as Response, next as NextFunction);
        expect(next.calledOnce).to.be.true;
        const error = next.args[0][0];
        expect(error).to.be.an.instanceOf(CustomError);
        expect(error.statusCode).to.equal(httpStatus.UNAUTHORIZED);
        expect(error.message).to.equal(ErrorMessages.NOT_AUTHENTICATED);
    });

    it("should call next with error if token is invalid", async () => {
        req.get = sinon.stub().returns("Bearer invalid_token");
        await isAuth(req as Request, res as Response, next as NextFunction);
        expect(next.calledOnce).to.be.true;
        const error = next.args[0][0];
        expect(error).to.be.an.instanceOf(CustomError);
        expect(error.statusCode).to.equal(httpStatus.UNAUTHORIZED);
        expect(error.message).to.equal(ErrorMessages.NOT_AUTHENTICATED);
    });

    it("should call next with error if token is expired", async () => {
        const expiredToken = jwt.sign({ userId: 123 }, "invalid_secret", { expiresIn: -1 });
        req.get = sinon.stub().returns(`Bearer ${expiredToken}`);
        await isAuth(req as Request, res as Response, next as NextFunction);
        expect(next.calledOnce).to.be.true;
        const error = next.args[0][0];
        expect(error).to.be.an.instanceOf(CustomError);
        expect(error.statusCode).to.equal(httpStatus.UNAUTHORIZED);
        expect(error.message).to.equal(ErrorMessages.NOT_AUTHENTICATED);
    });

    it("should call next with error if user not found", async () => {
        const validToken = jwt.sign({ userId: 123 }, AUTH_SECRET);
        req.get = sinon.stub().returns(`Bearer ${validToken}`);
        jwt.verify = sinon.stub().returns({ userId: 123 });
        User.findByPk = sinon.stub().returns(Promise.resolve(null)); // Mock user not found
        await isAuth(req as Request, res as Response, next as NextFunction);
        expect(next.calledOnce).to.be.true;
        const error = next.args[0][0];
        expect(error).to.be.an.instanceOf(CustomError);
        expect(error.statusCode).to.equal(httpStatus.UNAUTHORIZED);
        expect(error.message).to.equal(ErrorMessages.NOT_AUTHENTICATED);
    });

    it("should call next without error if everything is valid", async () => {
        const validToken = jwt.sign({ userId: 123 }, AUTH_SECRET);
        req.get = sinon.stub().returns(`Bearer ${validToken}`);
        jwt.verify = sinon.stub().returns({ userId: 123 });
        User.findByPk = sinon.stub().returns(Promise.resolve({ id: 123 } as any)); // Mock user found
        await isAuth(req as Request, res as Response, next as NextFunction);
        expect(next.calledOnce).to.be.true;
        expect(next.calledWithExactly()).to.be.true;
    });
});
