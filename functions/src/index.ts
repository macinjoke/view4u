import { setGlobalOptions } from 'firebase-functions'

export { getUserByUsername } from './funcs/getUserByUsername'
// Import all functions
export { getUserTweets } from './funcs/getUserTweets'

setGlobalOptions({ maxInstances: 10 })
