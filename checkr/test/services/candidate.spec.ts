import { assert, expect } from "chai";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import CandidateService from "../../src/services/candidate";
import { IUser } from "../../src/common/interfaces/user";
import { syncModels } from "../../src/utils/db";
import { Candidate } from "../../src/models/candidate";
import CustomError from "../../src/common/interfaces/custom-error";
import { User } from "../../src/models/user";
import { ErrorMessages } from "../../src/common/constants/messages";
import { CandidateReport } from "../../src/models/candidate-report";
import { Adjudication, Status } from "../../src/common/constants/global";
import { PreAdverseEmail } from "../../src/models/pre-adverse-email";
import { CourtSearch } from "../../src/models/court-search";

describe("Candidate Service", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let user: IUser;
    let candidateData: any;
    let candidate: any;

    before(async () => {
        await syncModels();
        user = await User.create({
            name: "test user",
            email: "test@user.com",
            password: "testuserpass",
        });
        candidateData = {
            "name": "John Smith",
            "email": "john.smith@checkr.com",
            "dob": "1990-09-10T00:00:00.000Z",
            "phone": "1231234645",
            "location": "Telangana",
            "zipcode": "12345",
            "socialSecurity": "123-12-6789",
            "driversLicense": "FTEST1111(CA)",
            "report": {
                "status": "clear",
                "adjudication": null,
                "package": "employee pro",
                "turnAroundTime": 1234123,
            },
            "courtSearch": [
                {
                    "search": "SSN Verification",
                    "status": "clear",
                    "date": "2022-02-21T18:30:00.000Z"
                },
                {
                    "search": "Sex Offender",
                    "status": "clear",
                    "date": "2022-03-12T18:30:00.000Z"
                },
                {
                    "search": "Global Watchlist",
                    "status": "consider",
                    "date": "2022-07-01T18:30:00.000Z"
                }
            ]
        }
        candidate = await CandidateService.addCandidate(user, candidateData, candidateData.report, candidateData.courtSearch);
        console.log("candidate:", candidate);

    });

    beforeEach(() => {
        req = { body: {} };
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("getCandidateList", () => {
        it("should get candidate list", async () => {
            const data = await CandidateService.getCandidateList(user, { pageNo: 1, pageSize: 20 }, { search: '', filter: {} });
            expect(data).to.have.property("data");
            expect(data).to.have.property("totalCount");
            expect(data.data).to.be.an("array");
            expect(data.totalCount).to.be.a("number");
            if (data.totalCount > 0) {
                expect(data.data[0]).to.have.property("name");
                expect(data.data[0]).to.have.property("location");
                expect(data.data[0]).to.have.property("status");
                expect(data.data[0]).to.have.property("adjudication");
                expect(data.data[0]).to.have.property("updatedAt");
            } else {
                console.log("Candidate list is empty");
            }
        });
    });

    describe("getCandidateById", () => {
        it("should get candidate by id", async () => {
            const data = await CandidateService.getCandidateById(user, 1);
            expect(data).to.have.property("name");
            expect(data).to.have.property("location");
            expect(data).to.have.property("updatedAt");
            expect(data).to.have.property("candidateReport");
            expect(data).to.have.property("courtSearch");
        });
    });

    describe("getCandidateById - throws error when candidateId is not found", () => {
        it("should get candidate by id", async () => {
            sinon.stub(Candidate, 'findOne').returns(Promise.resolve(null) as any as Promise<Candidate>);
            try {
                const data = await CandidateService.getCandidateById(user, 12);
                // If no error is thrown, fail the test
                assert.fail("Expected an error to be thrown.");
            } catch (error: any) {
                expect(error).to.be.an.instanceOf(CustomError);
                expect(error.message).to.equal("Candidate not found");
                expect(error.statusCode).to.equal(400);
            }
            (Candidate.findOne as any).restore();
        });
    });

    describe("addCandidate", () => {
        it("should add candidate", async () => {
            const data = await CandidateService.addCandidate(user, candidateData, candidateData.report, candidateData.courtSearch);
            expect(data).to.have.property("candidateId");
            expect(data).to.have.property("userId");
            expect(data).to.have.property("email");
            expect(data).to.have.property("name");
            expect(data).to.have.property("dob");
            expect(data).to.have.property("phone");
            expect(data).to.have.property("zipcode");
            expect(data).to.have.property("location");

            Candidate.destroy({ where: { candidateId: data.candidateId } });
        });
    });

    describe("exportCandidates", () => {
        it("should export candidates", async () => {
            const csvData = await CandidateService.exportCandidates(user);
            expect(csvData).to.be.a("string");
        });
    });

    describe("addCandidate - throws error when candidate is not added", () => {
        it("should add candidate", async () => {
            // Candidate.create = sinon.stub().throws(new Error("Some error occurred while adding candidate"));
            sinon.stub(Candidate, 'create').throws(new Error("Some error occurred while adding candidate"));
            try {
                const data = await CandidateService.addCandidate(user, candidateData, candidateData.report, candidateData.courtSearch);
                // If no error is thrown, fail the test
                assert.fail("Expected an error to be thrown.");
            } catch (error: any) {
                expect(error).to.be.an.instanceOf(CustomError);
                expect(error.message).to.equal(ErrorMessages.errorAdding("Candidate"));
                expect(error.statusCode).to.equal(500);
            }
            (Candidate.create as any).restore();
        });
    });

    describe("getCandidateList - throws error when candidates are not fetched", () => {
        it("should get candidate list", async () => {
            // Candidate.findAll = sinon.stub().throws(new Error("Error fetching candidates"));
            sinon.stub(Candidate, 'findAll').throws(new Error("Error fetching candidates"));
            try {
                const data = await CandidateService.getCandidateList(user, { pageNo: 1, pageSize: 20 }, { search: '', filter: {} });
                // If no error is thrown, fail the test
                assert.fail("Expected an error to be thrown.");
            } catch (error: any) {
                expect(error).to.be.an.instanceOf(CustomError);
                expect(error.message).to.equal(ErrorMessages.errorFetching("Candidates"));
                expect(error.statusCode).to.equal(500);
            }
            (Candidate.findAll as any).restore();
        });
    });

    describe("engageCandidate", () => {
        it("should engage candidate", async () => {
            try {
                await CandidateService.engageCandidate(user, candidate.candidateId);
                const candidateReport = await CandidateReport.findOne({ where: { candidateId: candidate.candidateId } });
                expect(candidateReport?.status).to.equal(Status.CLEAR);
                expect(candidateReport?.adjudication).to.equal(Adjudication.ENGAGE);
                const preAdverseEmail = await PreAdverseEmail.findAll({ where: { candidateId: candidate.candidateId } });
                expect(preAdverseEmail).to.be.an("array").that.is.empty;
            } catch (e) {
                console.log("error:", e);
                assert.fail("Not expected an error to be thrown.");
            }
        });
    });

    describe("preAdverseAction", () => {
        it("should perform pre adverse action", async () => {
            const preAdverseData = {
                fromEmail: "from@gmail.com",
                toEmail: "to@gmail.com",
                subject: "Subject",
                body: "Body",
                count: 3,
                days: 3
            };
            try {
                await CandidateService.preAdverseAction(user, candidate.candidateId, preAdverseData);
                const candidateReport = await CandidateReport.findOne({ where: { candidateId: candidate.candidateId } });
                expect(candidateReport?.status).to.equal(Status.CONSIDER);
                expect(candidateReport?.adjudication).to.equal(Adjudication.ADVERSE_ACTION);
                const preAdverseEmail = await PreAdverseEmail.findAll({ where: { candidateId: candidate.candidateId } });
                expect(preAdverseEmail).to.be.an("array").that.is.not.empty;
                await PreAdverseEmail.destroy({ where: { candidateId: candidate.candidateId } });
            } catch (e) {
                console.log("error:", e);
                assert.fail("Not expected an error to be thrown.");
            }
        });
    });

    after(async () => {
        await User.destroy({ where: { userId: user.userId } });
        await CandidateReport.destroy({ where: { candidateId: candidate.candidateId } });
        await PreAdverseEmail.destroy({ where: { candidateId: candidate.candidateId } });
        await CourtSearch.destroy({ where: { candidateId: candidate.candidateId } });
        await Candidate.destroy({ where: { candidateId: candidate.candidateId } });
    });
});