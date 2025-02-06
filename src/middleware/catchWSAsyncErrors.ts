// const resWS = require("../utils/resWS");

// module.exports =
//     (func) =>
//     async (...rest) => {
//         try {
//             func(...rest);
//         } catch (err) {
//             console.log(err, "ERR");
//             const [[payload, cb], { io, socket, event }] = rest;
//             if (cb) {
//                 cb(resWS.builder.error(err?.message, err));
//             }
//             socket.emit(event, resWS.builder.error(err?.message, err));
//         }
//     };
