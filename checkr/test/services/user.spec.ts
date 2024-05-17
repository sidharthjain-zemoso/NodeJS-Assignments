import { assert, expect } from "chai";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import UserService from "../../src/services/user";
import { User } from "../../src/models/user";
import bcrypt from "bcryptjs";
import CustomError from "../../src/common/interfaces/custom-error";
import { ErrorMessages } from "../../src/common/constants/messages";
import { IUser } from "../../src/common/interfaces/user";

describe("User Service", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;

    beforeEach(() => {
        req = { body: {} };
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    describe("loginUser", () => {
        it("should login user", async () => {
            const email = "test@gmail.com";
            const password = "password";
            User.findOne = sinon.stub().returns({
                email,
                password: await bcrypt.hash(password, 12),
                userId: 123,
            });
            const data = await UserService.loginUser(email, password);
            expect(data).to.have.property("token");
            expect(data).to.have.property("user");
        });

        it("should throw custom error with Invalid Credentials message and 401 status code", async () => {
            const email = "test@gmail.com";
            const password = "password";
            User.findOne = sinon.stub().returns(null);
            try {
                await UserService.loginUser(email, password);
                // If no error is thrown, fail the test
                assert.fail("Expected an error to be thrown.");
            } catch (error: any) {
                expect(error).to.be.an.instanceOf(CustomError);
                expect(error.statusCode).to.equal(401);
                expect(error.message).to.equal(ErrorMessages.INVALID_CREDENTIALS);
            }
        });


        it("should throw custom error with Invalid Credentials message and 401 status code", async () => {
            const email = "test@gmail.com";
            const password = "password";
            User.findOne = sinon.stub().returns({
                email,
                password: await bcrypt.hash("wrong_password", 12),
                userId: 123,
            });
            try {
                await UserService.loginUser(email, password);
                // If no error is thrown, fail the test
                assert.fail("Expected an error to be thrown.");
            } catch (error: any) {
                expect(error).to.be.an.instanceOf(CustomError);
                expect(error.statusCode).to.equal(401);
                expect(error.message).to.equal(ErrorMessages.INVALID_CREDENTIALS);
            }
        });
    });

    describe("signupUser", () => {
        it("should signup user", async () => {
            const user: IUser = {
                name: "test",
                email: "test2@gmail.com",
                password: "password",
            };
            const oldPass = user.password;
            User.findOne = sinon.stub().returns(null);
            User.create = sinon.stub().callsFake((user) => user);
            const newUser = await UserService.signupUser(user);
            expect(newUser!.email).to.equal(user.email);
            expect(newUser!.name).to.equal(user.name);
            const isMatch = await bcrypt.compare(oldPass, newUser!.password);
            expect(isMatch).to.be.true;
        });

        it("should throw custom error saying user already exists", async () => {
            const user: IUser = {
                name: "test",
                email: "test2@gmail.com",
                password: "password",
            };
            User.findOne = sinon.stub().returns(user);
            User.create = sinon.stub().callsFake((user) => user);
            try {
                const newUser = await UserService.signupUser(user);
                // If no error is thrown, fail the test
                assert.fail("Expected an error to be thrown.");
            } catch (error: any) {
                expect(error).to.be.an.instanceOf(CustomError);
                expect(error.statusCode).to.equal(400);
                expect(error.message).to.equal(ErrorMessages.USER_EXISTS);
            };
        });
    });
});