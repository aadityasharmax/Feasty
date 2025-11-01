import User from '../models/user.model.js';   

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user is set by auth middleware
        if(!userId){
            return res.status(400).json({message:"User ID not found in request"})
        }
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const updateUserLocation = async (req,res) => {
    try {
        const {latitude,longitude} = req.body;
        if(!latitude || ! longitude){
            res.status(400).json({message:"Latitude or Longitude missing"})
        }

        const user = await User.findByIdAndUpdate(req.userId,{
            location:{
                type:'Point',
                coordinates:[longitude,latitude]
            }
        },{new:true})
        if(!user){
            res.status(400).json({message:"user not found"})
        }

        return res.status(200).json({message:"Location updated"})

        
    } catch (error) {
        res.status(500).json({ message: 'Update User Location error', error: error.message });
    }
}