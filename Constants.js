const DEBUG = false;
const APP_VERSION = 'App Version';

const CONSTANTS = {
  DEBUG,
  APP_VERSION,
  IS_VALID_ADDRESS: 'https://chain.so/api/v2/is_address_valid/$TYPE/$ADDRESS',
  FETCH_ADDRESS_DETAILS: 'https://chain.so/api/v2/address/$TYPE/$ADDRESS',
  FETCH_RECIEVED_TRANSECTIONS: 'https://chain.so/api/v2/get_tx_received/$TYPE/$ADDRESS',
  FETCH_RECIEVED_TRANSECTIONS_CONTINUE: 'https://chain.so/api/v2/get_tx_received/$TYPE/$ADDRESS/$LAST',
  FETCH_SPENT_TRANSECTIONS: 'https://chain.so/api/v2/get_tx_spent/$TYPE/$ADDRESS',
  FETCH_SPENT_TRANSECTIONS_CONTINUE: 'https://chain.so/api/v2/get_tx_spent/$TYPE/$ADDRESS/$LAST'
};

export default CONSTANTS;
