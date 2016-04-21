/**
 * Created by denman on 1/12/16.
 */


//unfortunately using Object.freeze prevents code completion, FOL

module.exports = Object.freeze({

    DEBUGGING_NODE_ENV: 'dev_local_debug',
    SUMAN_SERVER_MESSAGE: 'SUMAN_SERVER_MESSAGE',
    SUMAN_HARD_LIST: [
        'delay',
        'suite',
        'before',
        'after',
        'beforeEach',
        'afterEach',
        'it',
        'test',
        'describe',
        'context',
        'extra',
        '$uda',
        'writable'
    ],
    CORE_MODULE_LIST: require('builtin-modules'),
    EXIT_CODES: {
        SUCCESSFUL_RUN: 0,
        GREP_SUITE_DID_NOT_MATCH: 0,
        BAD_GREP_SUITE_OPTION:52,
        SUMAN_UNCAUGHT_EXCEPTION: 53,
        BAD_CONFIG_OR_PROGRAM_ARGUMENTS: 54,
        UNEXPECTED_NON_FATAL_ERROR: 55,
        TEST_CASE_FAIL: 56,
        INVALID_ARROW_FUNCTION_USAGE: 57,
        BAD_COMMAND_LINE_OPTION: 58,
        UNEXPECTED_FATAL_ERROR: 59,
        FATAL_TEST_ERROR: 60,
        FATAL_HOOK_ERROR: 61,
        SUITE_TIMEOUT: 62,
        SUITE_BAIL: 63,
        INTEGRANT_VERIFICATION_FAILURE: 64,
        UNKNOWN_RUNNER_CHILD_PROCESS_STATE: 65,
        ERROR_IN_ROOT_SUITE: 66,
        IOC_DEPS_ACQUISITION_ERROR: 67,
        EXPORT_TEST_BUT_RAN_TEST_FILE_DIRECTLY: 68,
        DELAY_NOT_REFERENCED: 69,
        INTEGRANT_VERIFICATION_ERROR: 70,
        ERROR_CREATED_SUMAN_OBJ: 71,
        IOC_PASSED_TO_SUMAN_INIT_BAD_FORM: 72,
        ERROR_ACQUIRING_IOC_DEPS: 73,
        INVALID_RUNNER_CHILD_PROCESS_STATE: 74,
        NO_TIMESTAMP_AVAILABLE_IN_TEST: 75,
        ERROR_INVOKING_NETWORK_LOG_IN_RUNNER: 76,
        ERROR_CREATED_NETWORK_LOG: 77,
        ERROR_CREATING_RESULTS_DIR: 78,
        COULD_NOT_FIND_CONFIG_FROM_PATH: 79,
        TEST_ERROR_AND_BAIL_IS_TRUE: 80
    },
    ERROR_MESSAGES: {
        INVALID_FUNCTION_TYPE_USAGE: 'You cannot use an arrow function with describe callbacks; however, you may use arrow functions everywhere else.\n' +
        'The reason is because every describe call creates a new nested test instance, and "this" is bound to that instance. \nFor every describe call, you ' +
        'need a regular function as a callback. The remainder of your tests can be arrow function galore. \nIf you dont understand this, read up on how arrow functions bind "this" ' +
        'to lexical scope, and why they cant just be used everywhere.'
    },
    runner_message_type: {
        FATAL: 'FATAL',
        TABLE_DATA:'TABLE_DATA',
        INTEGRANT_INFO:'INTEGRANT_INFO',
        LOG_DATA:'LOG_DATA',
        LOG_RESULT:'LOG_RESULT',
        FATAL_SOFT:'FATAL_SOFT',
        WARNING:'WARNING',
        NON_FATAL_ERR:'NON_FATAL_ERR',
        CONSOLE_LOG:'CONSOLE_LOG',
        MAX_MEMORY:'MAX_MEMORY'
    }

});