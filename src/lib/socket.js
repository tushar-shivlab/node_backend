require('events').EventEmitter.defaultMaxListeners = 15;
import { userGroupModel, userModel } from '../model';
var resoponseArray = [];
var olddata;
function createserver(socketServer) {
    const io = require('socket.io')(socketServer, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
        allowEIO3: true,
    });
    io.on('connection', async (socket) => {
        // console.log('client connected', socket.id);
        socket.on('mouse', (data) => {
            // console.log('data :>> ', data);
            if (data != null) socket.broadcast.emit('mouse', data);
        });

        // Define change stream
        const changeStream = userGroupModel.watch();
        // start listen to changes

        changeStream.on('change', async (change) => {
            if (olddata != change._id._data) {
                olddata = change._id._data;
                if (change.operationType === 'update') {
                    let id = change.documentKey;
                    const group = await userGroupModel.findById(id);
                    let userId = group.user[group.user.length - 1];

                    const user = await userModel.findById(userId);

                    // console.log('user :>> ', user);
                    const groupId = group.id;
                    // console.log('true :>> ', change);

                    socket.broadcast.emit(groupId, user);
                }
            }
        });
    });
    io.on('disconnect', function () {
        console.log('Client has disconnected');
    });
}
export function dbData(data, db) {
    console.log('data :>> ', data);
    if (db === true) {
        resoponseArray = data;
    } else if (db === false) {
        console.log('function :>> ', dbData);
        resoponseArray = [];
    }
}

const socket = (server) => {
    createserver(server);
};
export default socket;
