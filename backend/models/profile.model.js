import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    degree:{
        type:String,
        default:''
    },
    fieldOfStudy:{
        type:String,
        default:''
    },
    passingYear:{
        type:Number,
        default: null
    },
    institution:{
        type:String,
        default:''
    },
});

const datingSchema = new mongoose.Schema({
    relationshipStatus: {
        type: String,
        default: ''
    },
    interests: {
        type: [String],
        default: []
    },
    lookingFor: {
        type: String,
        default: ''
    }
});

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    gender:{
        type: String,
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    currentPost:{
        type: String,
        default: '' 
    },
    education:{
        type: [educationSchema],
        default: []
    },
    dating: {
        type: [datingSchema],
        default: []
    },
    socialLinks: {
        instagram: {
            type: String,
            default: ''
        },
    }
    
});

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;