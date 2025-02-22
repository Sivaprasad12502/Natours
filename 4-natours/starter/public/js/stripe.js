import axios from 'axios';
import { showAlert } from './alert';

// const stripe = Stripe(
//   'pk_live_51QuuaQHHIj6eYHaPM7YHKx5W4pmey1uosklzpa6RKBAulyHng1h5Yg0jliP36p3ktnPquPze2seyIdJyiI9mBUfc00fF3eJAvH',
// );

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);

    //2) Create checkout form + Chance credit card

    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    })

    
  } catch (err) {
    console.error('Error booking tour:', err);
    showAlert('Something went wrong. Please try again!');
  }
};
