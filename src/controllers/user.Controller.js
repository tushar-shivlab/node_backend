import { Types } from 'mongoose';
import { userModel, userGroupModel } from '../model';
const joinGroup = async (req, res) => {
    let message = 'user saved successfully';
    try {
        const { body } = req;
        const { name } = body;
        const user = new userModel({ name });
        const userSave = await user.save();
        if (!userSave) {
            throw 'user not save';
        }
        let saveuserGroup;
        let groupId;
        if (userSave) {
            let data = await userGroupModel.findOne().sort({ createdAt: -1 });
            console.log('true :>> ', data);

            if (data===null || data.user.length === 5) {
                let id = [];
                id.push(userSave._id);
                const userGroup = new userGroupModel({ user: id });
                saveuserGroup = await userGroup.save();
                groupId = saveuserGroup._id;
            } else {
                let userId = userSave._id;

                saveuserGroup = await userGroupModel.updateOne(
                    { _id: data._id },
                    {
                        $push: { user: Types.ObjectId(userId) },
                    },
                );

                groupId = data._id;
            }
            if (!saveuserGroup) {
                throw 'userGroup not save';
            } else {
                const data = await userGroupModel.findById(groupId);
                const userList = await userModel.find({
                    _id: { $in: data.user },
                });
                console.log('demo :>> ');
                res.status(200).send({
                    success: true,
                    message,
                    data,
                    userList,
                });
            }
        }
    } catch (error) {
        res.status(400).send({
            success: true,
            message: error.message,
        });
    }
};

export default {
    joinGroup,
};
