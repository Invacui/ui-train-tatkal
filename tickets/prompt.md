export const createBookingSchema = Joi.object({
  fromStation: Joi.string().required(),
  toStation: Joi.string().required(),
  travelDate: Joi.date().required(),
  dateFlexibility: Joi.boolean(),
  trainFlexibility: Joi.boolean(),
  stationFlexibility: Joi.boolean(),
  preferredTrainNumber: Joi.string().optional(),
  preferredClasses: Joi.array().items(Joi.string()),
  preferredTravelClass: Joi.string()
    .valid('SL', '2S', '3A', '3E', '2A', '1A', 'CC', 'EC')
    .optional(),
  quotaCode: Joi.string().valid('GN', 'TQ', 'LD', 'SS').optional(),
  needHomeDelivery: Joi.boolean().optional(),
  passengers: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        gender: Joi.string().required(),
        berthPreference: Joi.string()
          .valid('LB', 'UB', 'MB', 'SL', 'SU', 'WS', 'SM')
          .optional(),
        idType: Joi.string()
          .valid('aadhaar', 'pan', 'passport', 'driving_license')
          .optional(),
        idNumber: Joi.string().optional(),
      }),
    )
    .optional(),
});

Task 1: This is the new schema in backend api so update the api calls accordingly
Task 2 call booking patch api at evey completed step to patch relevent info given in schema of booking
const bookingSchema = new Schema(
  {
    // Customer & Agent
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', index: true },
    teamMemberId: { type: Schema.Types.ObjectId, ref: 'AgentTeamMember' },

    // Journey details
    fromStation: { type: String, required: true, trim: true },
    toStation: { type: String, required: true, trim: true },
    travelDate: { type: Date, required: true, index: true },
    originalTravelDate: { type: Date },
    dateFlexibility: { type: Boolean, default: false },
    trainFlexibility: { type: Boolean, default: false },
    stationFlexibility: { type: Boolean, default: false },
    preferredTrainNumber: { type: String, trim: true },
    preferredClasses: { type: [String], default: [] },
    preferredTravelClass: {
      type: String,
      enum: ['SL', '2S', '3A', '3E', '2A', '1A', 'CC', 'EC'],
    },
    bookedClass: { type: String, trim: true },
    quotaCode: {
      type: String,
      enum: ['GN', 'TQ', 'LD', 'SS'],
    },
    needHomeDelivery: { type: Boolean, default: false },

    // Passengers
    passengers: { type: [PassengerSchema], default: [] },

    // Status & PNR
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PAYMENT_PENDING,
      index: true,
    },
    pnr: { type: String, trim: true, index: true, sparse: true },
    pnrStatus: {
      type: String,
      enum: Object.values(PNR_STATUS),
    },

    // Booking info
    bookingMode: {
      type: String,
      enum: Object.values(BOOKING_MODE),
    },
    ticketPhotoUrl: { type: String, trim: true },
    eTicketUrl: { type: String, trim: true },

    // Delivery address
    deliveryAddress: {
      line1: { type: String, trim: true },
      line2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      lat: { type: Number },
      lon: { type: Number },
    },

    // Geolocation (customer's location at booking time)
    userLat: { type: Number },
    userLon: { type: Number },
    calculatedDistance: { type: Number },

    // Pricing
    ticketFare: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    convenienceFee: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Payment
    paymentId: { type: Schema.Types.ObjectId, ref: 'RazorpayPayment', index: true },
    razorpayOrderId: { type: String, trim: true, index: true, sparse: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    refundAmount: { type: Number, default: 0 },
    refundTriggeredAt: { type: Date },

    // Timeline
    assignedAt: { type: Date },
    bookedAt: { type: Date },
    slaDeadline: { type: Date },
    deliveredAt: { type: Date },
    confirmedByCustomerAt: { type: Date },
    agentPaidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

Task 3 :Update the User profile also at correct steps like address age and other use @openapi.json and find relevant patch operations in auth sections if any thing is not patchable just add that proper endpoint is not there for patching user data for this steps or this thing

Task 4: Show the maps Right now the map is not rendering at AbortController, when no agent is present its showing blank div load the map with user current location and nearby agents doesnt matter they exist or not. If no agent is present show a message "No agents available nearby" and show the map with user current location.