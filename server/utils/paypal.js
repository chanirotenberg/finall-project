import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

function environment() {
  return new checkoutNodeJssdk.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

export default { client };
