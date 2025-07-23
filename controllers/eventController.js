const Event = require('../models/Event');

const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const event = await Event.create({ title, description, date, location, creator: req.user._id });
  res.json(event);
};

const getEvents = async (req, res) => {
  const events = await Event.find().populate('creator', 'name');
  res.json(events);
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event.creator.toString() === req.user._id.toString() || req.user.isAdmin) {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Event.deleteOne({ _id: req.params.id }); // safer alternative to event.remove()

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createEvent, getEvents, updateEvent, deleteEvent };
