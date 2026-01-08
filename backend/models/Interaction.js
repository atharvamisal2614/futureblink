import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  response: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
