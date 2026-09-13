const mongoose = require("mongoose");

const inviteSettingsSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        inviteLogChannelId: {
            type: String,
            default: null
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("InviteSettings", inviteSettingsSchema);
