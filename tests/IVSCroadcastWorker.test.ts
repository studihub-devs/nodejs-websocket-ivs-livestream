// import { IvsClient } from "@aws-sdk/client-ivs";
// import { IVSBroadcastWorker } from "../src/tasks/IVSBroadcastWorker";

// // Mock the AWS IVS Client
// jest.mock("@aws-sdk/client-ivs", () => {
//     const originalModule = jest.requireActual("@aws-sdk/client-ivs");

//     // Mock the send method
//     return {
//         ...originalModule,
//         IvsClient: jest.fn().mockImplementation(() => {
//             return {
//                 send: jest.fn().mockImplementation(command => {
//                     // console.log(command)
//                     if (command.input.channelArn.includes("/validChannelId")) {
//                         return Promise.resolve({
//                             stream: {
//                                 health: "HEALTHY",
//                                 viewerCount: 100,
//                                 // other stream details...
//                             }
//                         });
//                     } else {
//                         throw new Error("Channel not found");
//                     }
//                 })
//             };
//         })
//     };
// });

// describe('IVSBroadcastWorker', () => {
//     // let ivsClient = new IvsClient({});
//     let worker = new IVSBroadcastWorker();

//     it('gets live information for a valid channel', async () => {
//         const channelId = 'validChannelId';
//         const info = await worker.fetchStreamDetails(channelId);

//         expect(info).toBeDefined();
//         expect(info?.health).toEqual('HEALTHY');
//         expect(info?.viewerCount).toEqual(100);
//     });

//     it('returns null for an invalid channel', async () => {
//         const channelId = 'invalidChannelId';
//         const info = await worker.fetchStreamDetails(channelId);

//         expect(info).toBeUndefined();
//     });
// });
