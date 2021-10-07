require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 8090:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashFiles = exports.create = void 0;
const internal_globber_1 = __nccwpck_require__(8298);
const internal_hash_files_1 = __nccwpck_require__(2448);
/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function create(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield internal_globber_1.DefaultGlobber.create(patterns, options);
    });
}
exports.create = create;
/**
 * Computes the sha256 hash of a glob
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function hashFiles(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let followSymbolicLinks = true;
        if (options && typeof options.followSymbolicLinks === 'boolean') {
            followSymbolicLinks = options.followSymbolicLinks;
        }
        const globber = yield create(patterns, { followSymbolicLinks });
        return internal_hash_files_1.hashFiles(globber);
    });
}
exports.hashFiles = hashFiles;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 1026:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOptions = void 0;
const core = __importStar(__nccwpck_require__(2186));
/**
 * Returns a copy with defaults filled in.
 */
function getOptions(copy) {
    const result = {
        followSymbolicLinks: true,
        implicitDescendants: true,
        matchDirectories: true,
        omitBrokenSymbolicLinks: true
    };
    if (copy) {
        if (typeof copy.followSymbolicLinks === 'boolean') {
            result.followSymbolicLinks = copy.followSymbolicLinks;
            core.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`);
        }
        if (typeof copy.implicitDescendants === 'boolean') {
            result.implicitDescendants = copy.implicitDescendants;
            core.debug(`implicitDescendants '${result.implicitDescendants}'`);
        }
        if (typeof copy.matchDirectories === 'boolean') {
            result.matchDirectories = copy.matchDirectories;
            core.debug(`matchDirectories '${result.matchDirectories}'`);
        }
        if (typeof copy.omitBrokenSymbolicLinks === 'boolean') {
            result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks;
            core.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`);
        }
    }
    return result;
}
exports.getOptions = getOptions;
//# sourceMappingURL=internal-glob-options-helper.js.map

/***/ }),

/***/ 8298:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultGlobber = void 0;
const core = __importStar(__nccwpck_require__(2186));
const fs = __importStar(__nccwpck_require__(5747));
const globOptionsHelper = __importStar(__nccwpck_require__(1026));
const path = __importStar(__nccwpck_require__(5622));
const patternHelper = __importStar(__nccwpck_require__(9005));
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_pattern_1 = __nccwpck_require__(4536);
const internal_search_state_1 = __nccwpck_require__(9117);
const IS_WINDOWS = process.platform === 'win32';
class DefaultGlobber {
    constructor(options) {
        this.patterns = [];
        this.searchPaths = [];
        this.options = globOptionsHelper.getOptions(options);
    }
    getSearchPaths() {
        // Return a copy
        return this.searchPaths.slice();
    }
    glob() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (var _b = __asyncValues(this.globGenerator()), _c; _c = yield _b.next(), !_c.done;) {
                    const itemPath = _c.value;
                    result.push(itemPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
    globGenerator() {
        return __asyncGenerator(this, arguments, function* globGenerator_1() {
            // Fill in defaults options
            const options = globOptionsHelper.getOptions(this.options);
            // Implicit descendants?
            const patterns = [];
            for (const pattern of this.patterns) {
                patterns.push(pattern);
                if (options.implicitDescendants &&
                    (pattern.trailingSeparator ||
                        pattern.segments[pattern.segments.length - 1] !== '**')) {
                    patterns.push(new internal_pattern_1.Pattern(pattern.negate, true, pattern.segments.concat('**')));
                }
            }
            // Push the search paths
            const stack = [];
            for (const searchPath of patternHelper.getSearchPaths(patterns)) {
                core.debug(`Search path '${searchPath}'`);
                // Exists?
                try {
                    // Intentionally using lstat. Detection for broken symlink
                    // will be performed later (if following symlinks).
                    yield __await(fs.promises.lstat(searchPath));
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        continue;
                    }
                    throw err;
                }
                stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
            }
            // Search
            const traversalChain = []; // used to detect cycles
            while (stack.length) {
                // Pop
                const item = stack.pop();
                // Match?
                const match = patternHelper.match(patterns, item.path);
                const partialMatch = !!match || patternHelper.partialMatch(patterns, item.path);
                if (!match && !partialMatch) {
                    continue;
                }
                // Stat
                const stats = yield __await(DefaultGlobber.stat(item, options, traversalChain)
                // Broken symlink, or symlink cycle detected, or no longer exists
                );
                // Broken symlink, or symlink cycle detected, or no longer exists
                if (!stats) {
                    continue;
                }
                // Directory
                if (stats.isDirectory()) {
                    // Matched
                    if (match & internal_match_kind_1.MatchKind.Directory && options.matchDirectories) {
                        yield yield __await(item.path);
                    }
                    // Descend?
                    else if (!partialMatch) {
                        continue;
                    }
                    // Push the child items in reverse
                    const childLevel = item.level + 1;
                    const childItems = (yield __await(fs.promises.readdir(item.path))).map(x => new internal_search_state_1.SearchState(path.join(item.path, x), childLevel));
                    stack.push(...childItems.reverse());
                }
                // File
                else if (match & internal_match_kind_1.MatchKind.File) {
                    yield yield __await(item.path);
                }
            }
        });
    }
    /**
     * Constructs a DefaultGlobber
     */
    static create(patterns, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new DefaultGlobber(options);
            if (IS_WINDOWS) {
                patterns = patterns.replace(/\r\n/g, '\n');
                patterns = patterns.replace(/\r/g, '\n');
            }
            const lines = patterns.split('\n').map(x => x.trim());
            for (const line of lines) {
                // Empty or comment
                if (!line || line.startsWith('#')) {
                    continue;
                }
                // Pattern
                else {
                    result.patterns.push(new internal_pattern_1.Pattern(line));
                }
            }
            result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns));
            return result;
        });
    }
    static stat(item, options, traversalChain) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note:
            // `stat` returns info about the target of a symlink (or symlink chain)
            // `lstat` returns info about a symlink itself
            let stats;
            if (options.followSymbolicLinks) {
                try {
                    // Use `stat` (following symlinks)
                    stats = yield fs.promises.stat(item.path);
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        if (options.omitBrokenSymbolicLinks) {
                            core.debug(`Broken symlink '${item.path}'`);
                            return undefined;
                        }
                        throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
                    }
                    throw err;
                }
            }
            else {
                // Use `lstat` (not following symlinks)
                stats = yield fs.promises.lstat(item.path);
            }
            // Note, isDirectory() returns false for the lstat of a symlink
            if (stats.isDirectory() && options.followSymbolicLinks) {
                // Get the realpath
                const realPath = yield fs.promises.realpath(item.path);
                // Fixup the traversal chain to match the item level
                while (traversalChain.length >= item.level) {
                    traversalChain.pop();
                }
                // Test for a cycle
                if (traversalChain.some((x) => x === realPath)) {
                    core.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
                    return undefined;
                }
                // Update the traversal chain
                traversalChain.push(realPath);
            }
            return stats;
        });
    }
}
exports.DefaultGlobber = DefaultGlobber;
//# sourceMappingURL=internal-globber.js.map

/***/ }),

/***/ 2448:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashFiles = void 0;
const crypto = __importStar(__nccwpck_require__(6417));
const core = __importStar(__nccwpck_require__(2186));
const fs = __importStar(__nccwpck_require__(5747));
const stream = __importStar(__nccwpck_require__(2413));
const util = __importStar(__nccwpck_require__(1669));
const path = __importStar(__nccwpck_require__(5622));
function hashFiles(globber) {
    var e_1, _a;
    var _b;
    return __awaiter(this, void 0, void 0, function* () {
        let hasMatch = false;
        const githubWorkspace = (_b = process.env['GITHUB_WORKSPACE']) !== null && _b !== void 0 ? _b : process.cwd();
        const result = crypto.createHash('sha256');
        let count = 0;
        try {
            for (var _c = __asyncValues(globber.globGenerator()), _d; _d = yield _c.next(), !_d.done;) {
                const file = _d.value;
                core.debug(file);
                if (!file.startsWith(`${githubWorkspace}${path.sep}`)) {
                    core.debug(`Ignore '${file}' since it is not under GITHUB_WORKSPACE.`);
                    continue;
                }
                if (fs.statSync(file).isDirectory()) {
                    core.debug(`Skip directory '${file}'.`);
                    continue;
                }
                const hash = crypto.createHash('sha256');
                const pipeline = util.promisify(stream.pipeline);
                yield pipeline(fs.createReadStream(file), hash);
                result.write(hash.digest());
                count++;
                if (!hasMatch) {
                    hasMatch = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        result.end();
        if (hasMatch) {
            core.debug(`Found ${count} files to hash.`);
            return result.digest('hex');
        }
        else {
            core.debug(`No matches found for glob`);
            return '';
        }
    });
}
exports.hashFiles = hashFiles;
//# sourceMappingURL=internal-hash-files.js.map

/***/ }),

/***/ 1063:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchKind = void 0;
/**
 * Indicates whether a pattern matches a path
 */
var MatchKind;
(function (MatchKind) {
    /** Not matched */
    MatchKind[MatchKind["None"] = 0] = "None";
    /** Matched if the path is a directory */
    MatchKind[MatchKind["Directory"] = 1] = "Directory";
    /** Matched if the path is a regular file */
    MatchKind[MatchKind["File"] = 2] = "File";
    /** Matched */
    MatchKind[MatchKind["All"] = 3] = "All";
})(MatchKind = exports.MatchKind || (exports.MatchKind = {}));
//# sourceMappingURL=internal-match-kind.js.map

/***/ }),

/***/ 1849:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.safeTrimTrailingSeparator = exports.normalizeSeparators = exports.hasRoot = exports.hasAbsoluteRoot = exports.ensureAbsoluteRoot = exports.dirname = void 0;
const path = __importStar(__nccwpck_require__(5622));
const assert_1 = __importDefault(__nccwpck_require__(2357));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Similar to path.dirname except normalizes the path separators and slightly better handling for Windows UNC paths.
 *
 * For example, on Linux/macOS:
 * - `/               => /`
 * - `/hello          => /`
 *
 * For example, on Windows:
 * - `C:\             => C:\`
 * - `C:\hello        => C:\`
 * - `C:              => C:`
 * - `C:hello         => C:`
 * - `\               => \`
 * - `\hello          => \`
 * - `\\hello         => \\hello`
 * - `\\hello\world   => \\hello\world`
 */
function dirname(p) {
    // Normalize slashes and trim unnecessary trailing slash
    p = safeTrimTrailingSeparator(p);
    // Windows UNC root, e.g. \\hello or \\hello\world
    if (IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
        return p;
    }
    // Get dirname
    let result = path.dirname(p);
    // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
    if (IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
        result = safeTrimTrailingSeparator(result);
    }
    return result;
}
exports.dirname = dirname;
/**
 * Roots the path if not already rooted. On Windows, relative roots like `\`
 * or `C:` are expanded based on the current working directory.
 */
function ensureAbsoluteRoot(root, itemPath) {
    assert_1.default(root, `ensureAbsoluteRoot parameter 'root' must not be empty`);
    assert_1.default(itemPath, `ensureAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Already rooted
    if (hasAbsoluteRoot(itemPath)) {
        return itemPath;
    }
    // Windows
    if (IS_WINDOWS) {
        // Check for itemPath like C: or C:foo
        if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
            let cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            // Drive letter matches cwd? Expand to cwd
            if (itemPath[0].toUpperCase() === cwd[0].toUpperCase()) {
                // Drive only, e.g. C:
                if (itemPath.length === 2) {
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}`;
                }
                // Drive + path, e.g. C:foo
                else {
                    if (!cwd.endsWith('\\')) {
                        cwd += '\\';
                    }
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`;
                }
            }
            // Different drive
            else {
                return `${itemPath[0]}:\\${itemPath.substr(2)}`;
            }
        }
        // Check for itemPath like \ or \foo
        else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
            const cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            return `${cwd[0]}:\\${itemPath.substr(1)}`;
        }
    }
    assert_1.default(hasAbsoluteRoot(root), `ensureAbsoluteRoot parameter 'root' must have an absolute root`);
    // Otherwise ensure root ends with a separator
    if (root.endsWith('/') || (IS_WINDOWS && root.endsWith('\\'))) {
        // Intentionally empty
    }
    else {
        // Append separator
        root += path.sep;
    }
    return root + itemPath;
}
exports.ensureAbsoluteRoot = ensureAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\\hello\share` and `C:\hello` (and using alternate separator).
 */
function hasAbsoluteRoot(itemPath) {
    assert_1.default(itemPath, `hasAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \\hello\share or C:\hello
        return itemPath.startsWith('\\\\') || /^[A-Z]:\\/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasAbsoluteRoot = hasAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\`, `\hello`, `\\hello\share`, `C:`, and `C:\hello` (and using alternate separator).
 */
function hasRoot(itemPath) {
    assert_1.default(itemPath, `isRooted parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \ or \hello or \\hello
        // E.g. C: or C:\hello
        return itemPath.startsWith('\\') || /^[A-Z]:/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasRoot = hasRoot;
/**
 * Removes redundant slashes and converts `/` to `\` on Windows
 */
function normalizeSeparators(p) {
    p = p || '';
    // Windows
    if (IS_WINDOWS) {
        // Convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // Remove redundant slashes
        const isUnc = /^\\\\+[^\\]/.test(p); // e.g. \\hello
        return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\'); // preserve leading \\ for UNC
    }
    // Remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
exports.normalizeSeparators = normalizeSeparators;
/**
 * Normalizes the path separators and trims the trailing separator (when safe).
 * For example, `/foo/ => /foo` but `/ => /`
 */
function safeTrimTrailingSeparator(p) {
    // Short-circuit if empty
    if (!p) {
        return '';
    }
    // Normalize separators
    p = normalizeSeparators(p);
    // No trailing slash
    if (!p.endsWith(path.sep)) {
        return p;
    }
    // Check '/' on Linux/macOS and '\' on Windows
    if (p === path.sep) {
        return p;
    }
    // On Windows check if drive root. E.g. C:\
    if (IS_WINDOWS && /^[A-Z]:\\$/i.test(p)) {
        return p;
    }
    // Otherwise trim trailing slash
    return p.substr(0, p.length - 1);
}
exports.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
//# sourceMappingURL=internal-path-helper.js.map

/***/ }),

/***/ 6836:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Path = void 0;
const path = __importStar(__nccwpck_require__(5622));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(2357));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Helper class for parsing paths into segments
 */
class Path {
    /**
     * Constructs a Path
     * @param itemPath Path or array of segments
     */
    constructor(itemPath) {
        this.segments = [];
        // String
        if (typeof itemPath === 'string') {
            assert_1.default(itemPath, `Parameter 'itemPath' must not be empty`);
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
            // Not rooted
            if (!pathHelper.hasRoot(itemPath)) {
                this.segments = itemPath.split(path.sep);
            }
            // Rooted
            else {
                // Add all segments, while not at the root
                let remaining = itemPath;
                let dir = pathHelper.dirname(remaining);
                while (dir !== remaining) {
                    // Add the segment
                    const basename = path.basename(remaining);
                    this.segments.unshift(basename);
                    // Truncate the last segment
                    remaining = dir;
                    dir = pathHelper.dirname(remaining);
                }
                // Remainder is the root
                this.segments.unshift(remaining);
            }
        }
        // Array
        else {
            // Must not be empty
            assert_1.default(itemPath.length > 0, `Parameter 'itemPath' must not be an empty array`);
            // Each segment
            for (let i = 0; i < itemPath.length; i++) {
                let segment = itemPath[i];
                // Must not be empty
                assert_1.default(segment, `Parameter 'itemPath' must not contain any empty segments`);
                // Normalize slashes
                segment = pathHelper.normalizeSeparators(itemPath[i]);
                // Root segment
                if (i === 0 && pathHelper.hasRoot(segment)) {
                    segment = pathHelper.safeTrimTrailingSeparator(segment);
                    assert_1.default(segment === pathHelper.dirname(segment), `Parameter 'itemPath' root segment contains information for multiple segments`);
                    this.segments.push(segment);
                }
                // All other segments
                else {
                    // Must not contain slash
                    assert_1.default(!segment.includes(path.sep), `Parameter 'itemPath' contains unexpected path separators`);
                    this.segments.push(segment);
                }
            }
        }
    }
    /**
     * Converts the path to it's string representation
     */
    toString() {
        // First segment
        let result = this.segments[0];
        // All others
        let skipSlash = result.endsWith(path.sep) || (IS_WINDOWS && /^[A-Z]:$/i.test(result));
        for (let i = 1; i < this.segments.length; i++) {
            if (skipSlash) {
                skipSlash = false;
            }
            else {
                result += path.sep;
            }
            result += this.segments[i];
        }
        return result;
    }
}
exports.Path = Path;
//# sourceMappingURL=internal-path.js.map

/***/ }),

/***/ 9005:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.partialMatch = exports.match = exports.getSearchPaths = void 0;
const pathHelper = __importStar(__nccwpck_require__(1849));
const internal_match_kind_1 = __nccwpck_require__(1063);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Given an array of patterns, returns an array of paths to search.
 * Duplicates and paths under other included paths are filtered out.
 */
function getSearchPaths(patterns) {
    // Ignore negate patterns
    patterns = patterns.filter(x => !x.negate);
    // Create a map of all search paths
    const searchPathMap = {};
    for (const pattern of patterns) {
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        searchPathMap[key] = 'candidate';
    }
    const result = [];
    for (const pattern of patterns) {
        // Check if already included
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        if (searchPathMap[key] === 'included') {
            continue;
        }
        // Check for an ancestor search path
        let foundAncestor = false;
        let tempKey = key;
        let parent = pathHelper.dirname(tempKey);
        while (parent !== tempKey) {
            if (searchPathMap[parent]) {
                foundAncestor = true;
                break;
            }
            tempKey = parent;
            parent = pathHelper.dirname(tempKey);
        }
        // Include the search pattern in the result
        if (!foundAncestor) {
            result.push(pattern.searchPath);
            searchPathMap[key] = 'included';
        }
    }
    return result;
}
exports.getSearchPaths = getSearchPaths;
/**
 * Matches the patterns against the path
 */
function match(patterns, itemPath) {
    let result = internal_match_kind_1.MatchKind.None;
    for (const pattern of patterns) {
        if (pattern.negate) {
            result &= ~pattern.match(itemPath);
        }
        else {
            result |= pattern.match(itemPath);
        }
    }
    return result;
}
exports.match = match;
/**
 * Checks whether to descend further into the directory
 */
function partialMatch(patterns, itemPath) {
    return patterns.some(x => !x.negate && x.partialMatch(itemPath));
}
exports.partialMatch = partialMatch;
//# sourceMappingURL=internal-pattern-helper.js.map

/***/ }),

/***/ 4536:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pattern = void 0;
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(2357));
const minimatch_1 = __nccwpck_require__(3973);
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_path_1 = __nccwpck_require__(6836);
const IS_WINDOWS = process.platform === 'win32';
class Pattern {
    constructor(patternOrNegate, isImplicitPattern = false, segments, homedir) {
        /**
         * Indicates whether matches should be excluded from the result set
         */
        this.negate = false;
        // Pattern overload
        let pattern;
        if (typeof patternOrNegate === 'string') {
            pattern = patternOrNegate.trim();
        }
        // Segments overload
        else {
            // Convert to pattern
            segments = segments || [];
            assert_1.default(segments.length, `Parameter 'segments' must not empty`);
            const root = Pattern.getLiteral(segments[0]);
            assert_1.default(root && pathHelper.hasAbsoluteRoot(root), `Parameter 'segments' first element must be a root path`);
            pattern = new internal_path_1.Path(segments).toString().trim();
            if (patternOrNegate) {
                pattern = `!${pattern}`;
            }
        }
        // Negate
        while (pattern.startsWith('!')) {
            this.negate = !this.negate;
            pattern = pattern.substr(1).trim();
        }
        // Normalize slashes and ensures absolute root
        pattern = Pattern.fixupPattern(pattern, homedir);
        // Segments
        this.segments = new internal_path_1.Path(pattern).segments;
        // Trailing slash indicates the pattern should only match directories, not regular files
        this.trailingSeparator = pathHelper
            .normalizeSeparators(pattern)
            .endsWith(path.sep);
        pattern = pathHelper.safeTrimTrailingSeparator(pattern);
        // Search path (literal path prior to the first glob segment)
        let foundGlob = false;
        const searchSegments = this.segments
            .map(x => Pattern.getLiteral(x))
            .filter(x => !foundGlob && !(foundGlob = x === ''));
        this.searchPath = new internal_path_1.Path(searchSegments).toString();
        // Root RegExp (required when determining partial match)
        this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS ? 'i' : '');
        this.isImplicitPattern = isImplicitPattern;
        // Create minimatch
        const minimatchOptions = {
            dot: true,
            nobrace: true,
            nocase: IS_WINDOWS,
            nocomment: true,
            noext: true,
            nonegate: true
        };
        pattern = IS_WINDOWS ? pattern.replace(/\\/g, '/') : pattern;
        this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
    }
    /**
     * Matches the pattern against the specified path
     */
    match(itemPath) {
        // Last segment is globstar?
        if (this.segments[this.segments.length - 1] === '**') {
            // Normalize slashes
            itemPath = pathHelper.normalizeSeparators(itemPath);
            // Append a trailing slash. Otherwise Minimatch will not match the directory immediately
            // preceding the globstar. For example, given the pattern `/foo/**`, Minimatch returns
            // false for `/foo` but returns true for `/foo/`. Append a trailing slash to handle that quirk.
            if (!itemPath.endsWith(path.sep) && this.isImplicitPattern === false) {
                // Note, this is safe because the constructor ensures the pattern has an absolute root.
                // For example, formats like C: and C:foo on Windows are resolved to an absolute root.
                itemPath = `${itemPath}${path.sep}`;
            }
        }
        else {
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        }
        // Match
        if (this.minimatch.match(itemPath)) {
            return this.trailingSeparator ? internal_match_kind_1.MatchKind.Directory : internal_match_kind_1.MatchKind.All;
        }
        return internal_match_kind_1.MatchKind.None;
    }
    /**
     * Indicates whether the pattern may match descendants of the specified path
     */
    partialMatch(itemPath) {
        // Normalize slashes and trim unnecessary trailing slash
        itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        // matchOne does not handle root path correctly
        if (pathHelper.dirname(itemPath) === itemPath) {
            return this.rootRegExp.test(itemPath);
        }
        return this.minimatch.matchOne(itemPath.split(IS_WINDOWS ? /\\+/ : /\/+/), this.minimatch.set[0], true);
    }
    /**
     * Escapes glob patterns within a path
     */
    static globEscape(s) {
        return (IS_WINDOWS ? s : s.replace(/\\/g, '\\\\')) // escape '\' on Linux/macOS
            .replace(/(\[)(?=[^/]+\])/g, '[[]') // escape '[' when ']' follows within the path segment
            .replace(/\?/g, '[?]') // escape '?'
            .replace(/\*/g, '[*]'); // escape '*'
    }
    /**
     * Normalizes slashes and ensures absolute root
     */
    static fixupPattern(pattern, homedir) {
        // Empty
        assert_1.default(pattern, 'pattern cannot be empty');
        // Must not contain `.` segment, unless first segment
        // Must not contain `..` segment
        const literalSegments = new internal_path_1.Path(pattern).segments.map(x => Pattern.getLiteral(x));
        assert_1.default(literalSegments.every((x, i) => (x !== '.' || i === 0) && x !== '..'), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`);
        // Must not contain globs in root, e.g. Windows UNC path \\foo\b*r
        assert_1.default(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`);
        // Normalize slashes
        pattern = pathHelper.normalizeSeparators(pattern);
        // Replace leading `.` segment
        if (pattern === '.' || pattern.startsWith(`.${path.sep}`)) {
            pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
        }
        // Replace leading `~` segment
        else if (pattern === '~' || pattern.startsWith(`~${path.sep}`)) {
            homedir = homedir || os.homedir();
            assert_1.default(homedir, 'Unable to determine HOME directory');
            assert_1.default(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`);
            pattern = Pattern.globEscape(homedir) + pattern.substr(1);
        }
        // Replace relative drive root, e.g. pattern is C: or C:foo
        else if (IS_WINDOWS &&
            (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', pattern.substr(0, 2));
            if (pattern.length > 2 && !root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(2);
        }
        // Replace relative root, e.g. pattern is \ or \foo
        else if (IS_WINDOWS && (pattern === '\\' || pattern.match(/^\\[^\\]/))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', '\\');
            if (!root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(1);
        }
        // Otherwise ensure absolute root
        else {
            pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
        }
        return pathHelper.normalizeSeparators(pattern);
    }
    /**
     * Attempts to unescape a pattern segment to create a literal path segment.
     * Otherwise returns empty string.
     */
    static getLiteral(segment) {
        let literal = '';
        for (let i = 0; i < segment.length; i++) {
            const c = segment[i];
            // Escape
            if (c === '\\' && !IS_WINDOWS && i + 1 < segment.length) {
                literal += segment[++i];
                continue;
            }
            // Wildcard
            else if (c === '*' || c === '?') {
                return '';
            }
            // Character set
            else if (c === '[' && i + 1 < segment.length) {
                let set = '';
                let closed = -1;
                for (let i2 = i + 1; i2 < segment.length; i2++) {
                    const c2 = segment[i2];
                    // Escape
                    if (c2 === '\\' && !IS_WINDOWS && i2 + 1 < segment.length) {
                        set += segment[++i2];
                        continue;
                    }
                    // Closed
                    else if (c2 === ']') {
                        closed = i2;
                        break;
                    }
                    // Otherwise
                    else {
                        set += c2;
                    }
                }
                // Closed?
                if (closed >= 0) {
                    // Cannot convert
                    if (set.length > 1) {
                        return '';
                    }
                    // Convert to literal
                    if (set) {
                        literal += set;
                        i = closed;
                        continue;
                    }
                }
                // Otherwise fall thru
            }
            // Append
            literal += c;
        }
        return literal;
    }
    /**
     * Escapes regexp special characters
     * https://javascript.info/regexp-escaping
     */
    static regExpEscape(s) {
        return s.replace(/[[\\^$.|?*+()]/g, '\\$&');
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=internal-pattern.js.map

/***/ }),

/***/ 9117:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchState = void 0;
class SearchState {
    constructor(path, level) {
        this.path = path;
        this.level = level;
    }
}
exports.SearchState = SearchState;
//# sourceMappingURL=internal-search-state.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 5485:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Argument {
    constructor(value, range) {
        this.value = value;
        this.range = range;
    }
    toString() {
        return this.value;
    }
    getRange() {
        return this.range;
    }
    getValue() {
        return this.value;
    }
    isAfter(position) {
        if (this.range.end.line < position.line) {
            return false;
        }
        return this.range.start.line > position.line ? true : this.range.start.character > position.character;
    }
    isBefore(position) {
        if (this.range.start.line < position.line) {
            return true;
        }
        return this.range.end.line > position.line ? false : this.range.end.character < position.character;
    }
}
exports.Argument = Argument;


/***/ }),

/***/ 9743:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const line_1 = __nccwpck_require__(5921);
const util_1 = __nccwpck_require__(5215);
class Comment extends line_1.Line {
    constructor(document, range) {
        super(document, range);
    }
    toString() {
        const content = this.getContent();
        if (content) {
            return "# " + content;
        }
        return "#";
    }
    /**
     * Returns the content of this comment. This excludes leading and
     * trailing whitespace as well as the # symbol. If the comment only
     * consists of whitespace, the empty string will be returned.
     */
    getContent() {
        let range = this.getContentRange();
        if (range === null) {
            return "";
        }
        return this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
    }
    /**
     * Returns a range that includes the content of the comment
     * excluding any leading and trailing whitespace as well as the #
     * symbol. May return null if the comment only consists of whitespace
     * characters.
     */
    getContentRange() {
        let range = this.getRange();
        const startOffset = this.document.offsetAt(range.start);
        let raw = this.document.getText().substring(startOffset, this.document.offsetAt(range.end));
        let start = -1;
        let end = -1;
        // skip the first # symbol
        for (let i = 1; i < raw.length; i++) {
            if (!util_1.Util.isWhitespace(raw.charAt(i))) {
                start = i;
                break;
            }
        }
        if (start === -1) {
            return null;
        }
        // go backwards up to the first # symbol
        for (let i = raw.length - 1; i >= 1; i--) {
            if (!util_1.Util.isWhitespace(raw.charAt(i))) {
                end = i + 1;
                break;
            }
        }
        return vscode_languageserver_types_1.Range.create(this.document.positionAt(startOffset + start), this.document.positionAt(startOffset + end));
    }
}
exports.Comment = Comment;


/***/ }),

/***/ 2162:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const ast = __nccwpck_require__(989);
const imageTemplate_1 = __nccwpck_require__(5829);
const from_1 = __nccwpck_require__(1970);
const util_1 = __nccwpck_require__(5215);
const main_1 = __nccwpck_require__(989);
class Dockerfile extends imageTemplate_1.ImageTemplate {
    constructor(document) {
        super();
        this.initialInstructions = new imageTemplate_1.ImageTemplate();
        this.buildStages = [];
        this.directives = [];
        /**
         * Whether a FROM instruction has been added to this Dockerfile or not.
         */
        this.foundFrom = false;
        this.document = document;
    }
    getEscapeCharacter() {
        for (const directive of this.directives) {
            if (directive.getDirective() === ast.Directive.escape) {
                const value = directive.getValue();
                if (value === '\\' || value === '`') {
                    return value;
                }
            }
        }
        return '\\';
    }
    getInitialARGs() {
        return this.initialInstructions.getARGs();
    }
    getContainingImage(position) {
        let range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), this.document.positionAt(this.document.getText().length));
        if (!util_1.Util.isInsideRange(position, range)) {
            // not inside the document, invalid position
            return null;
        }
        if (this.initialInstructions.getComments().length > 0 || this.initialInstructions.getInstructions().length > 0) {
            if (util_1.Util.isInsideRange(position, this.initialInstructions.getRange())) {
                return this.initialInstructions;
            }
        }
        for (const buildStage of this.buildStages) {
            if (util_1.Util.isInsideRange(position, buildStage.getRange())) {
                return buildStage;
            }
        }
        return this;
    }
    addInstruction(instruction) {
        if (instruction.getKeyword() === main_1.Keyword.FROM) {
            this.currentBuildStage = new imageTemplate_1.ImageTemplate();
            this.buildStages.push(this.currentBuildStage);
            this.foundFrom = true;
        }
        else if (!this.foundFrom) {
            this.initialInstructions.addInstruction(instruction);
        }
        if (this.foundFrom) {
            this.currentBuildStage.addInstruction(instruction);
        }
        super.addInstruction(instruction);
    }
    setDirectives(directives) {
        this.directives = directives;
    }
    getDirective() {
        return this.directives.length === 0 ? null : this.directives[0];
    }
    getDirectives() {
        return this.directives;
    }
    resolveVariable(variable, line) {
        for (let from of this.getFROMs()) {
            let range = from.getRange();
            if (range.start.line <= line && line <= range.end.line) {
                // resolve the FROM variable against the initial ARGs
                let initialARGs = new imageTemplate_1.ImageTemplate();
                for (let instruction of this.initialInstructions.getARGs()) {
                    initialARGs.addInstruction(instruction);
                }
                return initialARGs.resolveVariable(variable, line);
            }
        }
        let image = this.getContainingImage(vscode_languageserver_types_1.Position.create(line, 0));
        if (image === null) {
            return undefined;
        }
        let resolvedVariable = image.resolveVariable(variable, line);
        if (resolvedVariable === null) {
            // refers to an uninitialized ARG variable,
            // try resolving it against the initial ARGs then
            let initialARGs = new imageTemplate_1.ImageTemplate();
            for (let instruction of this.initialInstructions.getARGs()) {
                initialARGs.addInstruction(instruction);
            }
            return initialARGs.resolveVariable(variable, line);
        }
        return resolvedVariable;
    }
    getAvailableVariables(currentLine) {
        if (this.getInstructionAt(currentLine) instanceof from_1.From) {
            let variables = [];
            for (let arg of this.getInitialARGs()) {
                let property = arg.getProperty();
                if (property) {
                    variables.push(property.getName());
                }
            }
            return variables;
        }
        let image = this.getContainingImage(vscode_languageserver_types_1.Position.create(currentLine, 0));
        return image ? image.getAvailableVariables(currentLine) : [];
    }
    getParentStage(image) {
        let from = image.getFROM();
        let imageName = from === null ? null : from.getImageName();
        if (imageName === null) {
            return null;
        }
        for (const from of this.getFROMs()) {
            if (from.getBuildStage() === imageName) {
                return this.getContainingImage(from.getRange().start);
            }
        }
        return null;
    }
    getStageHierarchy(line) {
        const image = this.getContainingImage(vscode_languageserver_types_1.Position.create(line, 0));
        if (image === null) {
            return [];
        }
        const stages = [image];
        let stage = this.getParentStage(image);
        while (stage !== null) {
            stages.splice(0, 0, stage);
            stage = this.getParentStage(stage);
        }
        return stages;
    }
    getAvailableWorkingDirectories(line) {
        const availableDirectories = new Set();
        for (const image of this.getStageHierarchy(line)) {
            for (const workdir of image.getWORKDIRs()) {
                if (workdir.getRange().end.line < line) {
                    let directory = workdir.getAbsolutePath();
                    if (directory !== undefined && directory !== null) {
                        if (!directory.endsWith("/")) {
                            directory += "/";
                        }
                        availableDirectories.add(directory);
                    }
                }
            }
        }
        return Array.from(availableDirectories);
    }
    /**
     * Internally reorganize the comments in the Dockerfile and allocate
     * them to the relevant build stages that they belong to.
     */
    organizeComments() {
        const comments = this.getComments();
        for (let i = 0; i < comments.length; i++) {
            if (util_1.Util.isInsideRange(comments[i].getRange().end, this.initialInstructions.getRange())) {
                this.initialInstructions.addComment(comments[i]);
            }
            else {
                for (const buildStage of this.buildStages) {
                    if (util_1.Util.isInsideRange(comments[i].getRange().start, buildStage.getRange())) {
                        buildStage.addComment(comments[i]);
                    }
                }
            }
        }
    }
    getRange() {
        const comments = this.getComments();
        const instructions = this.getInstructions();
        let range = null;
        if (comments.length === 0) {
            if (instructions.length > 0) {
                range = vscode_languageserver_types_1.Range.create(instructions[0].getRange().start, instructions[instructions.length - 1].getRange().end);
            }
        }
        else if (instructions.length === 0) {
            range = vscode_languageserver_types_1.Range.create(comments[0].getRange().start, comments[comments.length - 1].getRange().end);
        }
        else {
            const commentStart = comments[0].getRange().start;
            const commentEnd = comments[comments.length - 1].getRange().end;
            const instructionStart = instructions[0].getRange().start;
            const instructionEnd = instructions[instructions.length - 1].getRange().end;
            if (commentStart.line < instructionStart.line) {
                if (commentEnd.line < instructionEnd.line) {
                    range = vscode_languageserver_types_1.Range.create(commentStart, instructionEnd);
                }
                range = vscode_languageserver_types_1.Range.create(commentStart, commentEnd);
            }
            else if (commentEnd.line < instructionEnd.line) {
                range = vscode_languageserver_types_1.Range.create(instructionStart, instructionEnd);
            }
            else {
                range = vscode_languageserver_types_1.Range.create(instructionStart, commentEnd);
            }
        }
        if (range === null) {
            if (this.directives.length === 0) {
                return null;
            }
            return this.directives[0].getRange();
        }
        else if (this.directives.length === 0) {
            return range;
        }
        return vscode_languageserver_types_1.Range.create(this.directives[0].getRange().start, range.end);
    }
}
exports.Dockerfile = Dockerfile;


/***/ }),

/***/ 2314:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const flagOption_1 = __nccwpck_require__(9248);
class Flag {
    constructor(document, range, name, nameRange, value, valueRange) {
        this.options = [];
        this.range = range;
        this.name = name;
        this.nameRange = nameRange;
        this.value = value;
        this.valueRange = valueRange;
        if (this.value !== null) {
            let offset = document.offsetAt(valueRange.start);
            let nameStart = -1;
            let valueStart = -1;
            let hasOptions = false;
            for (let i = 0; i < value.length; i++) {
                switch (value.charAt(i)) {
                    case '=':
                        hasOptions = true;
                        if (valueStart === -1) {
                            valueStart = i + 1;
                            break;
                        }
                        break;
                    case ',':
                        this.options.push(this.createFlagOption(document, value, offset, nameStart, valueStart, i));
                        nameStart = -1;
                        valueStart = -1;
                        break;
                    default:
                        if (nameStart === -1) {
                            nameStart = i;
                        }
                        break;
                }
            }
            if (hasOptions && nameStart !== -1) {
                this.options.push(this.createFlagOption(document, value, offset, nameStart, valueStart, value.length));
            }
        }
    }
    createFlagOption(document, content, documentOffset, nameStart, valueStart, valueEnd) {
        const optionRange = vscode_languageserver_types_1.Range.create(document.positionAt(documentOffset + nameStart), document.positionAt(documentOffset + valueEnd));
        if (valueStart === -1) {
            return new flagOption_1.FlagOption(optionRange, content.substring(nameStart, valueEnd), optionRange, null, null);
        }
        return new flagOption_1.FlagOption(optionRange, content.substring(nameStart, valueStart - 1), vscode_languageserver_types_1.Range.create(document.positionAt(documentOffset + nameStart), document.positionAt(documentOffset + valueStart - 1)), content.substring(valueStart, valueEnd), vscode_languageserver_types_1.Range.create(document.positionAt(documentOffset + valueStart), document.positionAt(documentOffset + valueEnd)));
    }
    toString() {
        if (this.valueRange) {
            return "--" + this.name + "=" + this.value;
        }
        return "--" + this.name;
    }
    /**
     * Returns the range that encompasses this entire flag. This includes the
     * -- prefix in the beginning to the last character of the flag's value (if
     * it has been defined).
     *
     * @return the entire range of this flag
     */
    getRange() {
        return this.range;
    }
    /**
     * Returns the name of this flag. The name does not include the -- prefix.
     * Thus, for HEALTHCHECK's --interval flag, interval is the flag's name and
     * not --interval.
     *
     * @return this flag's name
     */
    getName() {
        return this.name;
    }
    /**
     * Returns the range that encompasses the flag's name
     *
     * @return the range containing the flag's name
     */
    getNameRange() {
        return this.nameRange;
    }
    /**
     * Returns the value that has been set to this flag. May be null if the
     * flag is invalid and has no value set like a --start-period. If the flag
     * is instead a --start-period= with an equals sign then the flag's value
     * is the empty string.
     *
     * @return this flag's value if it has been defined, null otherwise
     */
    getValue() {
        return this.value;
    }
    /**
     * Returns the range that encompasses this flag's value. If no value has
     * been set then null will be returned.
     *
     * @return the range containing this flag's value, or null if the flag
     *         has no value defined
     */
    getValueRange() {
        return this.valueRange;
    }
    getOption(name) {
        for (const option of this.options) {
            if (option.getName() === name) {
                return option;
            }
        }
        return null;
    }
    getOptions() {
        return this.options;
    }
    hasOptions() {
        return this.options.length > 0;
    }
}
exports.Flag = Flag;


/***/ }),

/***/ 9248:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class FlagOption {
    constructor(range, name, nameRange, value, valueRange) {
        this.range = range;
        this.name = name;
        this.nameRange = nameRange;
        this.value = value;
        this.valueRange = valueRange;
    }
    toString() {
        if (this.valueRange !== null) {
            return this.name + "=" + this.value;
        }
        return this.name;
    }
    getRange() {
        return this.range;
    }
    getName() {
        return this.name;
    }
    getNameRange() {
        return this.nameRange;
    }
    getValue() {
        return this.value;
    }
    getValueRange() {
        return this.valueRange;
    }
}
exports.FlagOption = FlagOption;


/***/ }),

/***/ 5829:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const arg_1 = __nccwpck_require__(5864);
const cmd_1 = __nccwpck_require__(5479);
const copy_1 = __nccwpck_require__(518);
const env_1 = __nccwpck_require__(7700);
const entrypoint_1 = __nccwpck_require__(9591);
const from_1 = __nccwpck_require__(1970);
const healthcheck_1 = __nccwpck_require__(6545);
const onbuild_1 = __nccwpck_require__(8);
const util_1 = __nccwpck_require__(5215);
const workdir_1 = __nccwpck_require__(713);
class ImageTemplate {
    constructor() {
        this.comments = [];
        this.instructions = [];
    }
    addComment(comment) {
        this.comments.push(comment);
    }
    getComments() {
        return this.comments;
    }
    addInstruction(instruction) {
        this.instructions.push(instruction);
    }
    getInstructions() {
        return this.instructions;
    }
    getInstructionAt(line) {
        for (let instruction of this.instructions) {
            if (util_1.Util.isInsideRange(vscode_languageserver_types_1.Position.create(line, 0), instruction.getRange())) {
                return instruction;
            }
        }
        return null;
    }
    /**
     * Gets all the ARG instructions that are defined in this image.
     */
    getARGs() {
        let args = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof arg_1.Arg) {
                args.push(instruction);
            }
        }
        return args;
    }
    /**
     * Gets all the CMD instructions that are defined in this image.
     */
    getCMDs() {
        let cmds = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof cmd_1.Cmd) {
                cmds.push(instruction);
            }
        }
        return cmds;
    }
    /**
     * Gets all the COPY instructions that are defined in this image.
     */
    getCOPYs() {
        let copies = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof copy_1.Copy) {
                copies.push(instruction);
            }
        }
        return copies;
    }
    /**
     * Gets all the ENTRYPOINT instructions that are defined in this image.
     */
    getENTRYPOINTs() {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof entrypoint_1.Entrypoint) {
                froms.push(instruction);
            }
        }
        return froms;
    }
    /**
     * Gets all the ENV instructions that are defined in this image.
     */
    getENVs() {
        let args = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof env_1.Env) {
                args.push(instruction);
            }
        }
        return args;
    }
    getFROM() {
        for (const instruction of this.instructions) {
            if (instruction instanceof from_1.From) {
                return instruction;
            }
        }
        return null;
    }
    /**
     * Gets all the FROM instructions that are defined in this image.
     */
    getFROMs() {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof from_1.From) {
                froms.push(instruction);
            }
        }
        return froms;
    }
    /**
     * Gets all the HEALTHCHECK instructions that are defined in this image.
     */
    getHEALTHCHECKs() {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof healthcheck_1.Healthcheck) {
                froms.push(instruction);
            }
        }
        return froms;
    }
    getWORKDIRs() {
        const workdirs = [];
        for (const instruction of this.instructions) {
            if (instruction instanceof workdir_1.Workdir) {
                workdirs.push(instruction);
            }
        }
        return workdirs;
    }
    getOnbuildTriggers() {
        let triggers = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof onbuild_1.Onbuild) {
                let trigger = instruction.getTriggerInstruction();
                if (trigger) {
                    triggers.push(trigger);
                }
            }
        }
        return triggers;
    }
    getAvailableVariables(currentLine) {
        const variables = [];
        for (const arg of this.getARGs()) {
            if (arg.isBefore(currentLine)) {
                const property = arg.getProperty();
                if (property) {
                    const variable = property.getName();
                    if (variables.indexOf(variable) === -1) {
                        variables.push(variable);
                    }
                }
            }
        }
        for (const env of this.getENVs()) {
            if (env.isBefore(currentLine)) {
                for (const property of env.getProperties()) {
                    const variable = property.getName();
                    if (variables.indexOf(variable) === -1) {
                        variables.push(variable);
                    }
                }
            }
        }
        return variables;
    }
    /**
     * Resolves a variable with the given name at the specified line
     * to its value. If null is returned, then the variable has been
     * defined but no value was given. If undefined is returned, then
     * a variable with the given name has not been defined yet as of
     * the given line.
     *
     * @param variable the name of the variable to resolve
     * @param line the line number that the variable is on, zero-based
     * @return the value of the variable as defined by an ARG or ENV
     *         instruction, or null if no value has been specified, or
     *         undefined if a variable with the given name has not
     *         been defined
     */
    resolveVariable(variable, line) {
        let envs = this.getENVs();
        for (let i = envs.length - 1; i >= 0; i--) {
            if (envs[i].isBefore(line)) {
                for (let property of envs[i].getProperties()) {
                    if (property.getName() === variable) {
                        return property.getValue();
                    }
                }
            }
        }
        let args = this.getARGs();
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].isBefore(line)) {
                let property = args[i].getProperty();
                if (property && property.getName() === variable) {
                    return property.getValue();
                }
            }
        }
        return undefined;
    }
    getRange() {
        const instructions = this.getInstructions();
        if (instructions.length === 0) {
            // all templates should have instructions, this only happens for
            // the initial set of instruction
            return vscode_languageserver_types_1.Range.create(0, 0, 0, 0);
        }
        const instructionStart = instructions[0].getRange().start;
        const instructionEnd = instructions[instructions.length - 1].getRange().end;
        return vscode_languageserver_types_1.Range.create(instructionStart, instructionEnd);
    }
    contains(position) {
        const range = this.getRange();
        if (range === null) {
            return false;
        }
        return util_1.Util.isInsideRange(position, range);
    }
}
exports.ImageTemplate = ImageTemplate;


/***/ }),

/***/ 1923:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const util_1 = __nccwpck_require__(5215);
const line_1 = __nccwpck_require__(5921);
const argument_1 = __nccwpck_require__(5485);
const variable_1 = __nccwpck_require__(7884);
const main_1 = __nccwpck_require__(989);
class Instruction extends line_1.Line {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range);
        this.dockerfile = dockerfile;
        this.escapeChar = escapeChar;
        this.instruction = instruction;
        this.instructionRange = instructionRange;
    }
    toString() {
        let value = this.getKeyword();
        for (let arg of this.getRawArguments()) {
            value += ' ';
            value += arg.getValue();
        }
        return value;
    }
    getRangeContent(range) {
        if (range === null) {
            return null;
        }
        return this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
    }
    getInstructionRange() {
        return this.instructionRange;
    }
    getInstruction() {
        return this.instruction;
    }
    getKeyword() {
        return this.getInstruction().toUpperCase();
    }
    getArgumentsRange() {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }
        return vscode_languageserver_types_1.Range.create(args[0].getRange().start, args[args.length - 1].getRange().end);
    }
    getArgumentsRanges() {
        let args = this.getArguments();
        if (args.length === 0) {
            return [];
        }
        if (args[0].getRange().start.line === args[args.length - 1].getRange().end.line) {
            return [vscode_languageserver_types_1.Range.create(args[0].getRange().start, args[args.length - 1].getRange().end)];
        }
        let ranges = [];
        let end = -1;
        let startPosition = args[0].getRange().start;
        let range = this.getInstructionRange();
        let extra = this.document.offsetAt(startPosition) - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra, this.document.offsetAt(args[args.length - 1].getRange().end) - this.document.offsetAt(range.start));
        let offset = this.document.offsetAt(range.start) + extra;
        let start = false;
        let comment = false;
        for (let i = 0; i < fullArgs.length; i++) {
            let char = fullArgs.charAt(i);
            if (char === this.escapeChar) {
                let next = fullArgs.charAt(i + 1);
                if (next === ' ' || next === '\t') {
                    whitespaceCheck: for (let j = i + 2; j < fullArgs.length; j++) {
                        switch (fullArgs.charAt(j)) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                j++;
                            case '\n':
                                if (startPosition !== null) {
                                    ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                                }
                                startPosition = null;
                                start = true;
                                comment = false;
                                i = j;
                                break whitespaceCheck;
                            default:
                                break whitespaceCheck;
                        }
                    }
                }
                else if (next === '\r') {
                    if (startPosition !== null) {
                        ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                        startPosition = null;
                    }
                    start = true;
                    comment = false;
                    i += 2;
                }
                else if (next === '\n') {
                    if (startPosition !== null) {
                        ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                    }
                    startPosition = null;
                    start = true;
                    comment = false;
                    i++;
                }
                else {
                    i++;
                }
            }
            else if (util_1.Util.isNewline(char)) {
                if (comment) {
                    startPosition = null;
                    start = true;
                    comment = false;
                }
            }
            else {
                if (!comment) {
                    if (startPosition === null) {
                        if (char === '#') {
                            comment = true;
                            continue;
                        }
                        let position = this.document.positionAt(offset + i);
                        if (position.character !== 0) {
                            startPosition = vscode_languageserver_types_1.Position.create(position.line, 0);
                        }
                    }
                    end = i;
                }
            }
        }
        if (startPosition === null) {
            // should only happen if the last argument is on its own line with
            // no leading whitespace
            ranges.push(vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + end), this.document.positionAt(offset + end + 1)));
        }
        else {
            ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
        }
        return ranges;
    }
    getRawArgumentsContent() {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }
        return this.getRangeContent(vscode_languageserver_types_1.Range.create(args[0].getRange().start, args[args.length - 1].getRange().end));
    }
    getArgumentsContent() {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }
        let content = "";
        let ranges = this.getArgumentsRanges();
        let documentText = this.document.getText();
        for (let range of ranges) {
            content += documentText.substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
        }
        return content;
    }
    getArguments() {
        return this.getRawArguments();
    }
    getRawArguments() {
        let args = [];
        let range = this.getInstructionRange();
        let extra = this.document.offsetAt(range.end) - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra);
        let offset = this.document.offsetAt(range.start) + extra;
        let start = false;
        let comment = false;
        let found = -1;
        // determines whether the parser has found a space or tab
        // whitespace character that's a part of an escaped newline sequence
        let escapedWhitespaceDetected = false;
        // determines if the parser is currently in an escaped newline sequence
        let escaping = false;
        let escapeMarker = -1;
        let escapedArg = "";
        for (let i = 0; i < fullArgs.length; i++) {
            let char = fullArgs.charAt(i);
            if (util_1.Util.isWhitespace(char)) {
                if (escaping) {
                    escapedWhitespaceDetected = true;
                    if (util_1.Util.isNewline(char)) {
                        // reached a newline, any previously
                        // detected whitespace should be ignored
                        escapedWhitespaceDetected = false;
                        if (comment) {
                            // reached a newline, no longer in a comment
                            comment = false;
                            start = true;
                        }
                    }
                    continue;
                }
                else if (found !== -1) {
                    if (escapeMarker === -1) {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + i))));
                    }
                    else {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
                    }
                    escapeMarker = -1;
                    escapedArg = "";
                    found = -1;
                }
            }
            else if (char === this.escapeChar) {
                let next = fullArgs.charAt(i + 1);
                if (next === ' ' || next === '\t') {
                    whitespaceCheck: for (let j = i + 2; j < fullArgs.length; j++) {
                        let newlineCheck = fullArgs.charAt(j);
                        switch (newlineCheck) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                j++;
                            case '\n':
                                comment = false;
                                escaping = true;
                                start = true;
                                if (found !== -1) {
                                    escapeMarker = i;
                                }
                                i = j;
                                break whitespaceCheck;
                            default:
                                escapeMarker = i;
                                if (found === -1) {
                                    i = j - 1;
                                }
                                break whitespaceCheck;
                        }
                    }
                }
                else if (next === '\r') {
                    comment = false;
                    escaping = true;
                    start = true;
                    if (found !== -1 && escapeMarker === -1) {
                        escapeMarker = i;
                    }
                    i += 2;
                }
                else if (next === '\n') {
                    comment = false;
                    escaping = true;
                    start = true;
                    if (found !== -1 && escapeMarker === -1) {
                        escapeMarker = i;
                    }
                    i++;
                }
                else {
                    if (escapedWhitespaceDetected && escapeMarker !== -1) {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
                        escapedArg = "";
                        found = -1;
                    }
                    escapeMarker = -1;
                    escapedWhitespaceDetected = false;
                    escaping = false;
                    if (next === '$') {
                        escapedArg = escapedArg + char + next;
                    }
                    else if (next === '') {
                        // reached EOF, stop processing
                        break;
                    }
                    else {
                        escapedArg = escapedArg + next;
                    }
                    if (found === -1) {
                        found = i;
                    }
                    i++;
                }
            }
            else if (!comment) {
                if (start && char === '#') {
                    comment = true;
                }
                else {
                    if (escapedWhitespaceDetected && escapeMarker !== -1) {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
                        escapedArg = "";
                        found = -1;
                    }
                    escapedWhitespaceDetected = false;
                    escaping = false;
                    escapeMarker = -1;
                    escapedArg = escapedArg + char;
                    if (found === -1) {
                        found = i;
                    }
                }
                // non-whitespace character detected, reset
                start = false;
            }
        }
        if (found !== -1) {
            if (escapeMarker === -1) {
                args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + fullArgs.length))));
            }
            else {
                args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
            }
        }
        return args;
    }
    getExpandedArguments() {
        let args = this.getArguments();
        for (let i = 0; i < args.length; i++) {
            const argRange = args[i].getRange();
            let offset = this.document.offsetAt(argRange.start);
            const variables = this.parseVariables(offset, args[i].getValue());
            const swaps = [];
            let requiresExpansion = false;
            for (let variable of variables) {
                const value = this.dockerfile.resolveVariable(variable.getName(), variable.getNameRange().start.line);
                swaps.push(value);
                requiresExpansion = requiresExpansion || value !== undefined;
            }
            if (requiresExpansion) {
                let expanded = "";
                for (let j = 0; j < swaps.length; j++) {
                    const variableRange = variables[j].getRange();
                    const start = this.document.offsetAt(variableRange.start);
                    const end = this.document.offsetAt(variableRange.end);
                    if (swaps[j]) {
                        // replace variable with its resolved value
                        expanded += this.document.getText().substring(offset, start);
                        expanded += swaps[j];
                        offset = end;
                    }
                    else {
                        expanded += this.document.getText().substring(offset, end);
                        offset = end;
                    }
                }
                const argEnd = this.document.offsetAt(argRange.end);
                if (argEnd !== offset) {
                    // if the variable's range doesn't match the argument,
                    // append the remaining text
                    expanded += this.document.getText().substring(offset, argEnd);
                }
                args[i] = new argument_1.Argument(expanded, argRange);
            }
        }
        return args;
    }
    getVariables() {
        const variables = [];
        const args = this.getRawArguments();
        for (const arg of args) {
            let range = arg.getRange();
            let rawValue = this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
            const parsedVariables = this.parseVariables(this.document.offsetAt(arg.getRange().start), rawValue);
            for (const parsedVariable of parsedVariables) {
                variables.push(parsedVariable);
            }
        }
        return variables;
    }
    parseVariables(offset, arg) {
        let variables = [];
        variableLoop: for (let i = 0; i < arg.length; i++) {
            switch (arg.charAt(i)) {
                case this.escapeChar:
                    if (arg.charAt(i + 1) === '$') {
                        i++;
                    }
                    break;
                case '$':
                    if (arg.charAt(i + 1) === '{') {
                        let escapedString = "${";
                        let escapedName = "";
                        let nameEnd = -1;
                        let escapedSubstitutionParameter = "";
                        let substitutionStart = -1;
                        let substitutionEnd = -1;
                        let modifierRead = -1;
                        nameLoop: for (let j = i + 2; j < arg.length; j++) {
                            let char = arg.charAt(j);
                            switch (char) {
                                case this.escapeChar:
                                    for (let k = j + 1; k < arg.length; k++) {
                                        switch (arg.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                            case '\r':
                                                // ignore whitespace
                                                continue;
                                            case '\n':
                                                // escape this newline
                                                j = k;
                                                continue nameLoop;
                                        }
                                    }
                                    break;
                                case '}':
                                    escapedString += '}';
                                    let modifier = null;
                                    let modifierRange = null;
                                    let substitutionParameter = modifierRead !== -1 ? escapedSubstitutionParameter : null;
                                    let substitutionRange = null;
                                    if (nameEnd === -1) {
                                        nameEnd = j;
                                    }
                                    else if (nameEnd + 1 === j) {
                                        modifier = "";
                                        modifierRange = vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + nameEnd + 1), this.document.positionAt(offset + nameEnd + 1));
                                    }
                                    else {
                                        if (substitutionStart === -1) {
                                            // no substitution parameter found,
                                            // but a modifier character existed,
                                            // just offset the range by 1 from
                                            // the modifier character
                                            substitutionStart = modifierRead + 1;
                                            substitutionEnd = modifierRead + 1;
                                        }
                                        else {
                                            // offset one more from the last
                                            // character found
                                            substitutionEnd = substitutionEnd + 1;
                                        }
                                        modifier = arg.substring(modifierRead, modifierRead + 1);
                                        modifierRange = vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + modifierRead), this.document.positionAt(offset + modifierRead + 1));
                                        substitutionRange = vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + substitutionStart), this.document.positionAt(offset + substitutionEnd));
                                    }
                                    let start = this.document.positionAt(offset + i);
                                    variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 2), this.document.positionAt(offset + nameEnd)), vscode_languageserver_types_1.Range.create(start, this.document.positionAt(offset + j + 1)), modifier, modifierRange, substitutionParameter, substitutionRange, this.dockerfile.resolveVariable(escapedName, start.line) !== undefined, this.isBuildVariable(escapedName, start.line), escapedString));
                                    i = j;
                                    continue variableLoop;
                                case ':':
                                    if (nameEnd === -1) {
                                        nameEnd = j;
                                    }
                                    else if (modifierRead !== -1) {
                                        if (substitutionStart === -1) {
                                            substitutionStart = j;
                                            substitutionEnd = j;
                                        }
                                        else {
                                            substitutionEnd = j;
                                        }
                                        escapedSubstitutionParameter += ':';
                                    }
                                    else {
                                        modifierRead = j;
                                    }
                                    escapedString += ':';
                                    break;
                                case '\n':
                                case '\r':
                                case ' ':
                                case '\t':
                                    break;
                                default:
                                    if (nameEnd === -1) {
                                        escapedName += char;
                                    }
                                    else if (modifierRead !== -1) {
                                        if (substitutionStart === -1) {
                                            substitutionStart = j;
                                            substitutionEnd = j;
                                        }
                                        else {
                                            substitutionEnd = j;
                                        }
                                        escapedSubstitutionParameter += char;
                                    }
                                    else {
                                        modifierRead = j;
                                    }
                                    escapedString += char;
                                    break;
                            }
                        }
                        // no } found, not a valid variable, stop processing
                        break variableLoop;
                    }
                    else if (util_1.Util.isWhitespace(arg.charAt(i + 1)) || i === arg.length - 1) {
                        // $ followed by whitespace or EOF, ignore this variable
                        continue;
                    }
                    else {
                        let escapedName = "";
                        nameLoop: for (let j = i + 1; j < arg.length; j++) {
                            let char = arg.charAt(j);
                            switch (char) {
                                case '\r':
                                case '\n':
                                case ' ':
                                case '\t':
                                    continue;
                                case '$':
                                case '\'':
                                case '"':
                                    let varStart = this.document.positionAt(offset + i);
                                    variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)), vscode_languageserver_types_1.Range.create(varStart, this.document.positionAt(offset + j)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, varStart.line) !== undefined, this.isBuildVariable(escapedName, varStart.line), '$' + escapedName));
                                    i = j - 1;
                                    continue variableLoop;
                                case this.escapeChar:
                                    for (let k = j + 1; k < arg.length; k++) {
                                        switch (arg.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                            case '\r':
                                                // ignore whitespace
                                                continue;
                                            case '\n':
                                                // escape this newline
                                                j = k;
                                                continue nameLoop;
                                        }
                                    }
                                    // reached EOF after an escape character
                                    let start = this.document.positionAt(offset + i);
                                    variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)), vscode_languageserver_types_1.Range.create(start, this.document.positionAt(offset + j)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, start.line) !== undefined, this.isBuildVariable(escapedName, start.line), '$' + escapedName));
                                    break variableLoop;
                            }
                            if (char.match(/^[a-z0-9_]+$/i) === null) {
                                let varStart = this.document.positionAt(offset + i);
                                variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)), vscode_languageserver_types_1.Range.create(varStart, this.document.positionAt(offset + j)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, varStart.line) !== undefined, this.isBuildVariable(escapedName, varStart.line), '$' + escapedName));
                                i = j - 1;
                                continue variableLoop;
                            }
                            escapedName += char;
                        }
                        let start = this.document.positionAt(offset + i);
                        variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + arg.length)), vscode_languageserver_types_1.Range.create(start, this.document.positionAt(offset + arg.length)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, start.line) !== undefined, this.isBuildVariable(escapedName, start.line), '$' + escapedName));
                    }
                    break variableLoop;
            }
        }
        return variables;
    }
    isBuildVariable(variable, line) {
        if (this.getKeyword() === main_1.Keyword.FROM) {
            for (const initialArg of this.dockerfile.getInitialARGs()) {
                const arg = initialArg;
                const property = arg.getProperty();
                if (property && variable === property.getName()) {
                    return true;
                }
            }
            return undefined;
        }
        let image = this.dockerfile.getContainingImage(vscode_languageserver_types_1.Position.create(line, 0));
        let envs = image.getENVs();
        for (let i = envs.length - 1; i >= 0; i--) {
            if (envs[i].isBefore(line)) {
                for (let property of envs[i].getProperties()) {
                    if (property.getName() === variable) {
                        return false;
                    }
                }
            }
        }
        let args = image.getARGs();
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].isBefore(line)) {
                let property = args[i].getProperty();
                if (property && property.getName() === variable) {
                    return true;
                }
            }
        }
        return undefined;
    }
}
exports.Instruction = Instruction;


/***/ }),

/***/ 1541:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonInstruction_1 = __nccwpck_require__(1549);
class Add extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
}
exports.Add = Add;


/***/ }),

/***/ 5864:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const property_1 = __nccwpck_require__(2965);
const propertyInstruction_1 = __nccwpck_require__(7282);
class Arg extends propertyInstruction_1.PropertyInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
        this.property = null;
        const args = this.getPropertyArguments();
        if (args.length === 1) {
            this.property = new property_1.Property(this.document, this.escapeChar, args[0]);
        }
        else {
            this.property = null;
        }
    }
    /**
     * Returns the variable defined by this ARG. This may be null if
     * this ARG instruction is malformed and has no variable
     * declaration.
     */
    getProperty() {
        return this.property;
    }
}
exports.Arg = Arg;


/***/ }),

/***/ 5479:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonInstruction_1 = __nccwpck_require__(1549);
class Cmd extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Cmd = Cmd;


/***/ }),

/***/ 518:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonInstruction_1 = __nccwpck_require__(1549);
class Copy extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
    getFromFlag() {
        let flags = super.getFlags();
        return flags.length === 1 && flags[0].getName() === "from" ? flags[0] : null;
    }
}
exports.Copy = Copy;


/***/ }),

/***/ 9591:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonInstruction_1 = __nccwpck_require__(1549);
class Entrypoint extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Entrypoint = Entrypoint;


/***/ }),

/***/ 7700:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const propertyInstruction_1 = __nccwpck_require__(7282);
class Env extends propertyInstruction_1.PropertyInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getProperties() {
        return super.getProperties();
    }
}
exports.Env = Env;


/***/ }),

/***/ 1970:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const modifiableInstruction_1 = __nccwpck_require__(7049);
class From extends modifiableInstruction_1.ModifiableInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
    getImage() {
        return this.getRangeContent(this.getImageRange());
    }
    /**
     * Returns the name of the image that will be used as the base image.
     *
     * @return the base image's name, or null if unspecified
     */
    getImageName() {
        return this.getRangeContent(this.getImageNameRange());
    }
    /**
     * Returns the range that covers the name of the image used by
     * this instruction.
     *
     * @return the range of the name of this instruction's argument,
     *         or null if no image has been specified
     */
    getImageNameRange() {
        let range = this.getImageRange();
        if (range) {
            let registryRange = this.getRegistryRange();
            if (registryRange) {
                range.start = this.document.positionAt(this.document.offsetAt(registryRange.end) + 1);
            }
            let tagRange = this.getImageTagRange();
            let digestRange = this.getImageDigestRange();
            if (tagRange === null) {
                if (digestRange !== null) {
                    range.end = this.document.positionAt(this.document.offsetAt(digestRange.start) - 1);
                }
            }
            else {
                range.end = this.document.positionAt(this.document.offsetAt(tagRange.start) - 1);
            }
            return range;
        }
        return null;
    }
    /**
     * Returns the range that covers the image argument of this
     * instruction. This includes the tag or digest of the image if
     * it has been specified by the instruction.
     *
     * @return the range of the image argument, or null if no image
     *         has been specified
     */
    getImageRange() {
        let args = this.getArguments();
        return args.length !== 0 ? args[0].getRange() : null;
    }
    getImageTag() {
        return this.getRangeContent(this.getImageTagRange());
    }
    /**
     * Returns the range in the document that the tag of the base
     * image encompasses.
     *
     * @return the base image's tag's range in the document, or null
     *         if no tag has been specified
     */
    getImageTagRange() {
        const range = this.getImageRange();
        if (range) {
            if (this.getImageDigestRange() === null) {
                let content = this.getRangeContent(range);
                let index = this.lastIndexOf(this.document.offsetAt(range.start), content, ':');
                // the colon might be for a private registry's port and not a tag
                if (index > content.indexOf('/')) {
                    return vscode_languageserver_types_1.Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character);
                }
            }
        }
        return null;
    }
    getImageDigest() {
        return this.getRangeContent(this.getImageDigestRange());
    }
    /**
     * Returns the range in the document that the digest of the base
     * image encompasses.
     *
     * @return the base image's digest's range in the document, or null
     *         if no digest has been specified
     */
    getImageDigestRange() {
        let range = this.getImageRange();
        if (range) {
            let content = this.getRangeContent(range);
            let index = this.lastIndexOf(this.document.offsetAt(range.start), content, '@');
            if (index !== -1) {
                return vscode_languageserver_types_1.Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character);
            }
        }
        return null;
    }
    indexOf(documentOffset, content, searchString) {
        let index = content.indexOf(searchString);
        const variables = this.getVariables();
        for (let i = 0; i < variables.length; i++) {
            const position = documentOffset + index;
            const variableRange = variables[i].getRange();
            if (this.document.offsetAt(variableRange.start) < position && position < this.document.offsetAt(variableRange.end)) {
                const offset = this.document.offsetAt(variableRange.end) - documentOffset;
                const substring = content.substring(offset);
                const subIndex = substring.indexOf(searchString);
                if (subIndex === -1) {
                    return -1;
                }
                index = subIndex + offset;
                i = -1;
                continue;
            }
        }
        return index;
    }
    lastIndexOf(documentOffset, content, searchString) {
        let index = content.lastIndexOf(searchString);
        const variables = this.getVariables();
        for (let i = 0; i < variables.length; i++) {
            const position = documentOffset + index;
            const variableRange = variables[i].getRange();
            if (this.document.offsetAt(variableRange.start) < position && position < this.document.offsetAt(variableRange.end)) {
                index = content.substring(0, index).lastIndexOf(searchString);
                if (index === -1) {
                    return -1;
                }
                i = -1;
                continue;
            }
        }
        return index;
    }
    getRegistry() {
        return this.getRangeContent(this.getRegistryRange());
    }
    getRegistryRange() {
        const range = this.getImageRange();
        if (range) {
            const tagRange = this.getImageTagRange();
            const digestRange = this.getImageDigestRange();
            if (tagRange === null) {
                if (digestRange !== null) {
                    range.end = this.document.positionAt(this.document.offsetAt(digestRange.start) - 1);
                }
            }
            else {
                range.end = this.document.positionAt(this.document.offsetAt(tagRange.start) - 1);
            }
            const content = this.getRangeContent(range);
            const rangeStart = this.document.offsetAt(range.start);
            const portIndex = this.indexOf(rangeStart, content, ':');
            const dotIndex = this.indexOf(rangeStart, content, '.');
            const startingSlashIndex = this.indexOf(rangeStart, content, '/');
            // hostname detected
            if (portIndex !== -1 || dotIndex !== -1) {
                return vscode_languageserver_types_1.Range.create(range.start, this.document.positionAt(rangeStart + startingSlashIndex));
            }
            const registry = content.substring(0, startingSlashIndex);
            // localhost registry detected
            if (registry === 'localhost') {
                return vscode_languageserver_types_1.Range.create(range.start, this.document.positionAt(rangeStart + startingSlashIndex));
            }
        }
        return null;
    }
    getBuildStage() {
        let range = this.getBuildStageRange();
        return range === null ? null : this.getRangeContent(range);
    }
    getBuildStageRange() {
        let args = this.getArguments();
        if (args.length > 2 && args[1].getValue().toUpperCase() === "AS") {
            return args[2].getRange();
        }
        return null;
    }
    getPlatformFlag() {
        let flags = super.getFlags();
        return flags.length === 1 && flags[0].getName() === "platform" ? flags[0] : null;
    }
}
exports.From = From;


/***/ }),

/***/ 6545:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const modifiableInstruction_1 = __nccwpck_require__(7049);
class Healthcheck extends modifiableInstruction_1.ModifiableInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        argument = argument.toUpperCase();
        return argument === "CMD" || argument === "NONE";
    }
    getSubcommand() {
        let args = this.getArguments();
        return args.length !== 0 ? args[0] : null;
    }
}
exports.Healthcheck = Healthcheck;


/***/ }),

/***/ 1362:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const propertyInstruction_1 = __nccwpck_require__(7282);
const util_1 = __nccwpck_require__(5215);
class Label extends propertyInstruction_1.PropertyInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getVariables() {
        const variables = super.getVariables();
        const properties = this.getProperties();
        // iterate over all of this LABEL's properties
        for (const property of properties) {
            const value = property.getUnescapedValue();
            // check if the value is contained in single quotes,
            // single quotes would indicate a literal value
            if (value !== null && value.length > 2 && value.charAt(0) === '\'' && value.charAt(value.length - 1) === '\'') {
                const range = property.getValueRange();
                for (let i = 0; i < variables.length; i++) {
                    // if a variable is in a single quote, remove it from the list
                    if (util_1.Util.isInsideRange(variables[i].getRange().start, range)) {
                        variables.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        return variables;
    }
    getProperties() {
        return super.getProperties();
    }
}
exports.Label = Label;


/***/ }),

/***/ 8:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const parser_1 = __nccwpck_require__(2899);
const instruction_1 = __nccwpck_require__(1923);
class Onbuild extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getTrigger() {
        let trigger = this.getTriggerWord();
        return trigger === null ? null : trigger.toUpperCase();
    }
    getTriggerWord() {
        return this.getRangeContent(this.getTriggerRange());
    }
    getTriggerRange() {
        let args = this.getArguments();
        return args.length > 0 ? args[0].getRange() : null;
    }
    getTriggerInstruction() {
        let triggerRange = this.getTriggerRange();
        if (triggerRange === null) {
            return null;
        }
        let args = this.getArguments();
        return parser_1.Parser.createInstruction(this.document, this.dockerfile, this.escapeChar, vscode_languageserver_types_1.Range.create(args[0].getRange().start, this.getRange().end), this.getTriggerWord(), triggerRange);
    }
}
exports.Onbuild = Onbuild;


/***/ }),

/***/ 6814:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonInstruction_1 = __nccwpck_require__(1549);
class Run extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
}
exports.Run = Run;


/***/ }),

/***/ 3449:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonInstruction_1 = __nccwpck_require__(1549);
class Shell extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Shell = Shell;


/***/ }),

/***/ 3904:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const instruction_1 = __nccwpck_require__(1923);
class Stopsignal extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Stopsignal = Stopsignal;


/***/ }),

/***/ 4898:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const instruction_1 = __nccwpck_require__(1923);
class User extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.User = User;


/***/ }),

/***/ 2868:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonInstruction_1 = __nccwpck_require__(1549);
class Volume extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Volume = Volume;


/***/ }),

/***/ 713:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const instruction_1 = __nccwpck_require__(1923);
class Workdir extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    /**
     * Returns the path that has been defined. Note that this path may
     * be absolute or relative depending on what was written in the
     * instruction.
     *
     * @return the working directory's path, or null if this
     *         instruction has no arguments
     */
    getPath() {
        return this.getArgumentsContent();
    }
    /**
     * Returns the absolute path that this instruction resolves to. The
     * function will inspect prior WORKDIR instructions in the current
     * image or another build stage in the Dockerfile to try to
     * determine this.
     *
     * @return the absolute path of the working directory, or null if
     *         this instruction has no arguments, or undefined if it
     *         cannot be determined because only relative paths could be
     *         found
     */
    getAbsolutePath() {
        const path = this.getPath();
        if (path === null || path.startsWith("/")) {
            return path;
        }
        const startLine = this.getRange().start.line;
        const hierarchy = this.dockerfile.getStageHierarchy(startLine);
        for (let i = hierarchy.length - 1; i >= 0; i--) {
            const workdirs = hierarchy[i].getWORKDIRs();
            for (let j = workdirs.length - 1; j >= 0; j--) {
                if (workdirs[j].getRange().start.line < startLine) {
                    const parent = workdirs[j].getAbsolutePath();
                    if (parent === undefined || parent === null) {
                        return undefined;
                    }
                    return parent.endsWith("/") ? parent + path : parent + "/" + path;
                }
            }
        }
        return undefined;
    }
}
exports.Workdir = Workdir;


/***/ }),

/***/ 1025:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const argument_1 = __nccwpck_require__(5485);
class JSONArgument extends argument_1.Argument {
    constructor(value, range, jsonRange) {
        super(value, range);
        this.jsonRange = jsonRange;
    }
    getJSONRange() {
        return this.jsonRange;
    }
    getJSONValue() {
        let value = super.getValue();
        value = value.substring(1, value.length - 1);
        return value;
    }
}
exports.JSONArgument = JSONArgument;


/***/ }),

/***/ 1549:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const argument_1 = __nccwpck_require__(5485);
const jsonArgument_1 = __nccwpck_require__(1025);
const modifiableInstruction_1 = __nccwpck_require__(7049);
class JSONInstruction extends modifiableInstruction_1.ModifiableInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
        this.openingBracket = null;
        this.closingBracket = null;
        this.jsonStrings = [];
        const argsContent = this.getRawArgumentsContent();
        if (argsContent === null) {
            return;
        }
        const args = this.getArguments();
        if (args.length === 1 && args[0].getValue() === "[]") {
            let argRange = args[0].getRange();
            this.openingBracket = new argument_1.Argument("[", vscode_languageserver_types_1.Range.create(argRange.start.line, argRange.start.character, argRange.start.line, argRange.start.character + 1));
            this.closingBracket = new argument_1.Argument("]", vscode_languageserver_types_1.Range.create(argRange.start.line, argRange.start.character + 1, argRange.end.line, argRange.end.character));
            return;
        }
        else if (args.length === 2 && args[0].getValue() === '[' && args[1].getValue() === ']') {
            this.openingBracket = args[0];
            this.closingBracket = args[1];
            return;
        }
        const argsOffset = document.offsetAt(this.getArgumentsRange().start);
        let start = -1;
        let last = "";
        let quoted = false;
        let escapedArg = "";
        argsCheck: for (let i = 0; i < argsContent.length; i++) {
            let char = argsContent.charAt(i);
            switch (char) {
                case '[':
                    if (last === "") {
                        this.openingBracket = new argument_1.Argument("[", vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + i), document.positionAt(argsOffset + i + 1)));
                        last = '[';
                    }
                    else if (quoted) {
                        escapedArg = escapedArg + char;
                    }
                    else {
                        break argsCheck;
                    }
                    break;
                case '"':
                    if (last === '[' || last === ',') {
                        start = i;
                        quoted = true;
                        last = '"';
                        escapedArg = escapedArg + char;
                        continue;
                    }
                    else if (last === '"') {
                        if (quoted) {
                            escapedArg = escapedArg + char;
                            // quoted string done
                            quoted = false;
                            this.jsonStrings.push(new jsonArgument_1.JSONArgument(escapedArg, vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + start), document.positionAt(argsOffset + i + 1)), vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + start + 1), document.positionAt(argsOffset + i))));
                            escapedArg = "";
                        }
                        else {
                            // should be a , or a ]
                            break argsCheck;
                        }
                    }
                    else {
                        break argsCheck;
                    }
                    break;
                case ',':
                    if (quoted) {
                        escapedArg = escapedArg + char;
                    }
                    else {
                        if (last === '"') {
                            last = ',';
                        }
                        else {
                            break argsCheck;
                        }
                    }
                    break;
                case ']':
                    if (quoted) {
                        escapedArg = escapedArg + char;
                    }
                    else if (last !== "") {
                        this.closingBracket = new argument_1.Argument("]", vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + i), document.positionAt(argsOffset + i + 1)));
                        break argsCheck;
                    }
                    break;
                case ' ':
                case '\t':
                    break;
                case '\\':
                    if (quoted) {
                        switch (argsContent.charAt(i + 1)) {
                            case '"':
                            case '\\':
                                escapedArg = escapedArg + argsContent.charAt(i + 1);
                                i++;
                                continue;
                            case ' ':
                            case '\t':
                                escapeCheck: for (let j = i + 2; j < argsContent.length; j++) {
                                    switch (argsContent.charAt(j)) {
                                        case '\r':
                                            // offset one more for \r\n
                                            j++;
                                        case '\n':
                                            i = j;
                                            continue argsCheck;
                                        case ' ':
                                        case '\t':
                                            break;
                                        default:
                                            break escapeCheck;
                                    }
                                }
                                break;
                            case '\r':
                                // offset one more for \r\n
                                i++;
                            default:
                                i++;
                                continue;
                        }
                    }
                    else {
                        escapeCheck: for (let j = i + 1; j < argsContent.length; j++) {
                            switch (argsContent.charAt(j)) {
                                case '\r':
                                    // offset one more for \r\n
                                    j++;
                                case '\n':
                                    i = j;
                                    continue argsCheck;
                                case ' ':
                                case '\t':
                                    break;
                                default:
                                    break escapeCheck;
                            }
                        }
                    }
                    break argsCheck;
                default:
                    if (!quoted) {
                        break argsCheck;
                    }
                    escapedArg = escapedArg + char;
                    break;
            }
        }
    }
    stopSearchingForFlags(_value) {
        return true;
    }
    getOpeningBracket() {
        return this.openingBracket;
    }
    getJSONStrings() {
        return this.jsonStrings;
    }
    getClosingBracket() {
        return this.closingBracket;
    }
}
exports.JSONInstruction = JSONInstruction;


/***/ }),

/***/ 5921:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Line {
    constructor(document, range) {
        this.document = document;
        this.range = range;
    }
    getRange() {
        return this.range;
    }
    getTextContent() {
        return this.document.getText().substring(this.document.offsetAt(this.range.start), this.document.offsetAt(this.range.end));
    }
    isAfter(line) {
        return this.range.start.line > line.range.start.line;
    }
    isBefore(line) {
        return this.range.start.line < line;
    }
}
exports.Line = Line;


/***/ }),

/***/ 989:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var argument_1 = __nccwpck_require__(5485);
exports.Argument = argument_1.Argument;
var jsonArgument_1 = __nccwpck_require__(1025);
exports.JSONArgument = jsonArgument_1.JSONArgument;
const comment_1 = __nccwpck_require__(9743);
exports.Comment = comment_1.Comment;
const parser_1 = __nccwpck_require__(2899);
var flag_1 = __nccwpck_require__(2314);
exports.Flag = flag_1.Flag;
const instruction_1 = __nccwpck_require__(1923);
exports.Instruction = instruction_1.Instruction;
var line_1 = __nccwpck_require__(5921);
exports.Line = line_1.Line;
const parserDirective_1 = __nccwpck_require__(5292);
exports.ParserDirective = parserDirective_1.ParserDirective;
var property_1 = __nccwpck_require__(2965);
exports.Property = property_1.Property;
var variable_1 = __nccwpck_require__(7884);
exports.Variable = variable_1.Variable;
var add_1 = __nccwpck_require__(1541);
exports.Add = add_1.Add;
const arg_1 = __nccwpck_require__(5864);
exports.Arg = arg_1.Arg;
const cmd_1 = __nccwpck_require__(5479);
exports.Cmd = cmd_1.Cmd;
const copy_1 = __nccwpck_require__(518);
exports.Copy = copy_1.Copy;
const entrypoint_1 = __nccwpck_require__(9591);
exports.Entrypoint = entrypoint_1.Entrypoint;
const env_1 = __nccwpck_require__(7700);
exports.Env = env_1.Env;
const from_1 = __nccwpck_require__(1970);
exports.From = from_1.From;
const healthcheck_1 = __nccwpck_require__(6545);
exports.Healthcheck = healthcheck_1.Healthcheck;
var jsonInstruction_1 = __nccwpck_require__(1549);
exports.JSONInstruction = jsonInstruction_1.JSONInstruction;
var label_1 = __nccwpck_require__(1362);
exports.Label = label_1.Label;
var modifiableInstruction_1 = __nccwpck_require__(7049);
exports.ModifiableInstruction = modifiableInstruction_1.ModifiableInstruction;
var onbuild_1 = __nccwpck_require__(8);
exports.Onbuild = onbuild_1.Onbuild;
var propertyInstruction_1 = __nccwpck_require__(7282);
exports.PropertyInstruction = propertyInstruction_1.PropertyInstruction;
var shell_1 = __nccwpck_require__(3449);
exports.Shell = shell_1.Shell;
var stopsignal_1 = __nccwpck_require__(3904);
exports.Stopsignal = stopsignal_1.Stopsignal;
var user_1 = __nccwpck_require__(4898);
exports.User = user_1.User;
var volume_1 = __nccwpck_require__(2868);
exports.Volume = volume_1.Volume;
const workdir_1 = __nccwpck_require__(713);
exports.Workdir = workdir_1.Workdir;
var Keyword;
(function (Keyword) {
    Keyword["ADD"] = "ADD";
    Keyword["ARG"] = "ARG";
    Keyword["CMD"] = "CMD";
    Keyword["COPY"] = "COPY";
    Keyword["ENTRYPOINT"] = "ENTRYPOINT";
    Keyword["ENV"] = "ENV";
    Keyword["EXPOSE"] = "EXPOSE";
    Keyword["FROM"] = "FROM";
    Keyword["HEALTHCHECK"] = "HEALTHCHECK";
    Keyword["LABEL"] = "LABEL";
    Keyword["MAINTAINER"] = "MAINTAINER";
    Keyword["ONBUILD"] = "ONBUILD";
    Keyword["RUN"] = "RUN";
    Keyword["SHELL"] = "SHELL";
    Keyword["STOPSIGNAL"] = "STOPSIGNAL";
    Keyword["USER"] = "USER";
    Keyword["VOLUME"] = "VOLUME";
    Keyword["WORKDIR"] = "WORKDIR";
})(Keyword = exports.Keyword || (exports.Keyword = {}));
var Directive;
(function (Directive) {
    Directive["escape"] = "escape";
    Directive["syntax"] = "syntax";
})(Directive = exports.Directive || (exports.Directive = {}));
exports.DefaultVariables = [
    "FTP_PROXY", "ftp_proxy",
    "HTTP_PROXY", "http_proxy",
    "HTTPS_PROXY", "https_proxy",
    "NO_PROXY", "no_proxy"
];
var DockerfileParser;
(function (DockerfileParser) {
    function parse(content) {
        let parser = new parser_1.Parser();
        return parser.parse(content);
    }
    DockerfileParser.parse = parse;
})(DockerfileParser = exports.DockerfileParser || (exports.DockerfileParser = {}));


/***/ }),

/***/ 7049:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const flag_1 = __nccwpck_require__(2314);
const instruction_1 = __nccwpck_require__(1923);
class ModifiableInstruction extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getFlags() {
        if (!this.flags) {
            this.flags = [];
            for (let arg of this.getArguments()) {
                let value = arg.getValue();
                if (this.stopSearchingForFlags(value)) {
                    return this.flags;
                }
                else if (value.indexOf("--") === 0) {
                    let range = arg.getRange();
                    let rawValue = this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
                    let nameIndex = value.indexOf('=');
                    let index = rawValue.indexOf('=');
                    let firstMatch = false;
                    let secondMatch = false;
                    let startIndex = -1;
                    nameSearchLoop: for (let i = 0; i < rawValue.length; i++) {
                        switch (rawValue.charAt(i)) {
                            case '\\':
                            case ' ':
                            case '\t':
                            case '\r':
                            case '\n':
                                break;
                            case '-':
                                if (secondMatch) {
                                    startIndex = i;
                                    break nameSearchLoop;
                                }
                                else if (firstMatch) {
                                    secondMatch = true;
                                }
                                else {
                                    firstMatch = true;
                                }
                                break;
                            default:
                                startIndex = i;
                                break nameSearchLoop;
                        }
                    }
                    let nameStart = this.document.positionAt(this.document.offsetAt(range.start) + startIndex);
                    if (index === -1) {
                        this.flags.push(new flag_1.Flag(this.document, range, value.substring(2), vscode_languageserver_types_1.Range.create(nameStart, range.end), null, null));
                    }
                    else if (index === value.length - 1) {
                        let nameEnd = this.document.positionAt(this.document.offsetAt(range.start) + index);
                        this.flags.push(new flag_1.Flag(this.document, range, value.substring(2, index), vscode_languageserver_types_1.Range.create(nameStart, nameEnd), "", vscode_languageserver_types_1.Range.create(range.end, range.end)));
                    }
                    else {
                        let nameEnd = this.document.positionAt(this.document.offsetAt(range.start) + index);
                        this.flags.push(new flag_1.Flag(this.document, range, value.substring(2, nameIndex), vscode_languageserver_types_1.Range.create(nameStart, nameEnd), value.substring(nameIndex + 1), vscode_languageserver_types_1.Range.create(this.document.positionAt(this.document.offsetAt(range.start) + index + 1), range.end)));
                    }
                }
            }
        }
        return this.flags;
    }
    getArguments() {
        const args = super.getArguments();
        const flags = this.getFlags();
        if (flags.length === 0) {
            return args;
        }
        for (let i = 0; i < flags.length; i++) {
            args.shift();
        }
        return args;
    }
}
exports.ModifiableInstruction = ModifiableInstruction;


/***/ }),

/***/ 2899:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_languageserver_textdocument_1 = __nccwpck_require__(933);
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const comment_1 = __nccwpck_require__(9743);
const parserDirective_1 = __nccwpck_require__(5292);
const instruction_1 = __nccwpck_require__(1923);
const add_1 = __nccwpck_require__(1541);
const arg_1 = __nccwpck_require__(5864);
const cmd_1 = __nccwpck_require__(5479);
const copy_1 = __nccwpck_require__(518);
const env_1 = __nccwpck_require__(7700);
const entrypoint_1 = __nccwpck_require__(9591);
const from_1 = __nccwpck_require__(1970);
const healthcheck_1 = __nccwpck_require__(6545);
const label_1 = __nccwpck_require__(1362);
const onbuild_1 = __nccwpck_require__(8);
const run_1 = __nccwpck_require__(6814);
const shell_1 = __nccwpck_require__(3449);
const stopsignal_1 = __nccwpck_require__(3904);
const workdir_1 = __nccwpck_require__(713);
const user_1 = __nccwpck_require__(4898);
const volume_1 = __nccwpck_require__(2868);
const dockerfile_1 = __nccwpck_require__(2162);
const main_1 = __nccwpck_require__(989);
class Parser {
    constructor() {
        this.escapeChar = null;
    }
    static createInstruction(document, dockerfile, escapeChar, lineRange, instruction, instructionRange) {
        switch (instruction.toUpperCase()) {
            case "ADD":
                return new add_1.Add(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ARG":
                return new arg_1.Arg(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "CMD":
                return new cmd_1.Cmd(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "COPY":
                return new copy_1.Copy(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ENTRYPOINT":
                return new entrypoint_1.Entrypoint(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ENV":
                return new env_1.Env(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "FROM":
                return new from_1.From(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "HEALTHCHECK":
                return new healthcheck_1.Healthcheck(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "LABEL":
                return new label_1.Label(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ONBUILD":
                return new onbuild_1.Onbuild(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "RUN":
                return new run_1.Run(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "SHELL":
                return new shell_1.Shell(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "STOPSIGNAL":
                return new stopsignal_1.Stopsignal(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "WORKDIR":
                return new workdir_1.Workdir(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "USER":
                return new user_1.User(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "VOLUME":
                return new volume_1.Volume(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
        }
        return new instruction_1.Instruction(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
    }
    getParserDirectives(document, buffer) {
        // reset the escape directive in between runs
        const directives = [];
        this.escapeChar = '';
        directiveCheck: for (let i = 0; i < buffer.length; i++) {
            switch (buffer.charAt(i)) {
                case ' ':
                case '\t':
                    break;
                case '\r':
                case '\n':
                    // blank lines stop the parsing of directives immediately
                    break directiveCheck;
                case '#':
                    let directiveStart = -1;
                    let directiveEnd = -1;
                    for (let j = i + 1; j < buffer.length; j++) {
                        let char = buffer.charAt(j);
                        switch (char) {
                            case ' ':
                            case '\t':
                                if (directiveStart !== -1 && directiveEnd === -1) {
                                    directiveEnd = j;
                                }
                                break;
                            case '\r':
                            case '\n':
                                break directiveCheck;
                            case '=':
                                let valueStart = -1;
                                let valueEnd = -1;
                                if (directiveEnd === -1) {
                                    directiveEnd = j;
                                }
                                // assume the line ends with the file
                                let lineEnd = buffer.length;
                                directiveValue: for (let k = j + 1; k < buffer.length; k++) {
                                    char = buffer.charAt(k);
                                    switch (char) {
                                        case '\r':
                                        case '\n':
                                            if (valueStart !== -1 && valueEnd === -1) {
                                                valueEnd = k;
                                            }
                                            // line break found, reset
                                            lineEnd = k;
                                            break directiveValue;
                                        case '\t':
                                        case ' ':
                                            if (valueStart !== -1 && valueEnd === -1) {
                                                valueEnd = k;
                                            }
                                            continue;
                                        default:
                                            if (valueStart === -1) {
                                                valueStart = k;
                                            }
                                            break;
                                    }
                                }
                                if (directiveStart === -1) {
                                    // no directive, it's a regular comment
                                    break directiveCheck;
                                }
                                if (valueStart === -1) {
                                    // no non-whitespace characters found, highlight all the characters then
                                    valueStart = j + 1;
                                    valueEnd = lineEnd;
                                }
                                else if (valueEnd === -1) {
                                    // reached EOF
                                    valueEnd = buffer.length;
                                }
                                const lineRange = vscode_languageserver_types_1.Range.create(document.positionAt(i), document.positionAt(lineEnd));
                                const nameRange = vscode_languageserver_types_1.Range.create(document.positionAt(directiveStart), document.positionAt(directiveEnd));
                                const valueRange = vscode_languageserver_types_1.Range.create(document.positionAt(valueStart), document.positionAt(valueEnd));
                                directives.push(new parserDirective_1.ParserDirective(document, lineRange, nameRange, valueRange));
                                directiveStart = -1;
                                if (buffer.charAt(valueEnd) === '\r') {
                                    // skip over the \r
                                    i = valueEnd + 1;
                                }
                                else {
                                    i = valueEnd;
                                }
                                continue directiveCheck;
                            default:
                                if (directiveStart === -1) {
                                    directiveStart = j;
                                }
                                break;
                        }
                    }
                    break;
                default:
                    break directiveCheck;
            }
        }
        return directives;
    }
    parse(buffer) {
        this.document = vscode_languageserver_textdocument_1.TextDocument.create("", "", 0, buffer);
        this.buffer = buffer;
        let dockerfile = new dockerfile_1.Dockerfile(this.document);
        let directives = this.getParserDirectives(this.document, this.buffer);
        let offset = 0;
        this.escapeChar = '\\';
        if (directives.length > 0) {
            dockerfile.setDirectives(directives);
            this.escapeChar = dockerfile.getEscapeCharacter();
            // start parsing after the directives
            offset = this.document.offsetAt(vscode_languageserver_types_1.Position.create(directives.length, 0));
        }
        for (let i = offset; i < this.buffer.length; i++) {
            const char = this.buffer.charAt(i);
            switch (char) {
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    break;
                case '#':
                    i = this.processComment(dockerfile, i);
                    break;
                default:
                    i = this.processInstruction(dockerfile, char, i);
                    break;
            }
        }
        dockerfile.organizeComments();
        return dockerfile;
    }
    processInstruction(dockerfile, char, start) {
        let instruction = char;
        let instructionEnd = -1;
        let escapedInstruction = false;
        instructionCheck: for (let i = start + 1; i < this.buffer.length; i++) {
            char = this.buffer.charAt(i);
            switch (char) {
                case this.escapeChar:
                    escapedInstruction = true;
                    char = this.buffer.charAt(i + 1);
                    if (char === '\r' || char === '\n') {
                        if (instructionEnd === -1) {
                            instructionEnd = i;
                        }
                        i++;
                    }
                    else if (char === ' ' || char === '\t') {
                        for (let j = i + 2; j < this.buffer.length; j++) {
                            switch (this.buffer.charAt(j)) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                case '\n':
                                    i = j;
                                    continue instructionCheck;
                                default:
                                    // found an argument, mark end of instruction
                                    instructionEnd = i + 1;
                                    instruction = instruction + this.escapeChar;
                                    i = j - 2;
                                    continue instructionCheck;
                            }
                        }
                        // reached EOF
                        instructionEnd = i + 1;
                        instruction = instruction + this.escapeChar;
                        break instructionCheck;
                    }
                    else {
                        instructionEnd = i + 1;
                        instruction = instruction + this.escapeChar;
                        // reset and consider it as one contiguous word
                        escapedInstruction = false;
                    }
                    break;
                case ' ':
                case '\t':
                    if (escapedInstruction) {
                        // on an escaped newline, need to search for non-whitespace
                        escapeCheck: for (let j = i + 1; j < this.buffer.length; j++) {
                            switch (this.buffer.charAt(j)) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                case '\n':
                                    i = j;
                                    continue instructionCheck;
                                default:
                                    break escapeCheck;
                            }
                        }
                        escapedInstruction = false;
                    }
                    if (instructionEnd === -1) {
                        instructionEnd = i;
                    }
                    i = this.processArguments(dockerfile, instruction, instructionEnd, start, i);
                    dockerfile.addInstruction(this.createInstruction(dockerfile, instruction, start, instructionEnd, i));
                    return i;
                case '\r':
                case '\n':
                    if (escapedInstruction) {
                        continue;
                    }
                    if (instructionEnd === -1) {
                        instructionEnd = i;
                    }
                    dockerfile.addInstruction(this.createInstruction(dockerfile, instruction, start, i, i));
                    return i;
                default:
                    instructionEnd = i + 1;
                    instruction = instruction + char;
                    break;
            }
        }
        // reached EOF
        if (instructionEnd === -1) {
            instructionEnd = this.buffer.length;
        }
        dockerfile.addInstruction(this.createInstruction(dockerfile, instruction, start, instructionEnd, this.buffer.length));
        return this.buffer.length;
    }
    parseHeredocName(value) {
        value = value.substring(2);
        if (value.charAt(0) === '-') {
            value = value.substring(1);
        }
        if (value.charAt(0) === '"' || value.charAt(0) === '\'') {
            return value.substring(1, value.length - 1);
        }
        return value;
    }
    processHeredocs(instruction, offset) {
        let keyword = instruction.getKeyword();
        if (keyword === main_1.Keyword.ONBUILD) {
            instruction = instruction.getTriggerInstruction();
            if (instruction === null) {
                return offset;
            }
            keyword = instruction.getKeyword();
        }
        if (keyword !== main_1.Keyword.ADD && keyword !== main_1.Keyword.COPY && keyword !== main_1.Keyword.RUN) {
            return offset;
        }
        const heredocs = [];
        for (const arg of instruction.getArguments()) {
            const value = arg.getValue();
            if (value.startsWith("<<") && value.length > 2) {
                heredocs.push(this.parseHeredocName(value));
            }
        }
        if (heredocs.length > 0) {
            for (const heredoc of heredocs) {
                offset = this.parseHeredoc(heredoc, offset);
            }
        }
        return offset;
    }
    processArguments(dockerfile, instruction, instructionEnd, start, offset) {
        let escaped = false;
        argumentsCheck: for (let i = offset + 1; i < this.buffer.length; i++) {
            switch (this.buffer.charAt(i)) {
                case '\r':
                case '\n':
                    if (escaped) {
                        continue;
                    }
                    return this.processHeredocs(this.createInstruction(dockerfile, instruction, start, instructionEnd, i), i);
                case this.escapeChar:
                    const next = this.buffer.charAt(i + 1);
                    if (next === '\n' || next === '\r') {
                        escaped = true;
                        i++;
                    }
                    else if (next === ' ' || next === '\t') {
                        for (let j = i + 2; j < this.buffer.length; j++) {
                            switch (this.buffer.charAt(j)) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                case '\n':
                                    escaped = true;
                                default:
                                    i = j;
                                    continue argumentsCheck;
                            }
                        }
                        // reached EOF
                        return this.buffer.length;
                    }
                    continue;
                case '#':
                    if (escaped) {
                        i = this.processComment(dockerfile, i);
                        continue argumentsCheck;
                    }
                    break;
                case ' ':
                case '\t':
                    break;
                default:
                    if (escaped) {
                        escaped = false;
                    }
                    break;
            }
        }
        return this.buffer.length;
    }
    processComment(dockerfile, start) {
        let end = this.buffer.length;
        commentLoop: for (let i = start + 1; i < this.buffer.length; i++) {
            switch (this.buffer.charAt(i)) {
                case '\r':
                case '\n':
                    end = i;
                    break commentLoop;
            }
        }
        const range = vscode_languageserver_types_1.Range.create(this.document.positionAt(start), this.document.positionAt(end));
        dockerfile.addComment(new comment_1.Comment(this.document, range));
        return end;
    }
    parseHeredoc(heredocName, offset) {
        let startWord = -1;
        let lineStart = true;
        for (let i = offset; i < this.buffer.length; i++) {
            switch (this.buffer.charAt(i)) {
                case ' ':
                case '\t':
                    lineStart = false;
                    break;
                case '\r':
                case '\n':
                    if (startWord !== -1 && heredocName === this.buffer.substring(startWord, i)) {
                        return i;
                    }
                    startWord = -1;
                    lineStart = true;
                    break;
                default:
                    if (lineStart) {
                        startWord = i;
                        lineStart = false;
                    }
                    break;
            }
        }
        return this.buffer.length;
    }
    createInstruction(dockerfile, instruction, start, instructionEnd, end) {
        const startPosition = this.document.positionAt(start);
        const instructionRange = vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(instructionEnd));
        const lineRange = vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(end));
        return Parser.createInstruction(this.document, dockerfile, this.escapeChar, lineRange, instruction, instructionRange);
    }
}
exports.Parser = Parser;


/***/ }),

/***/ 5292:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __nccwpck_require__(989);
const line_1 = __nccwpck_require__(5921);
class ParserDirective extends line_1.Line {
    constructor(document, range, nameRange, valueRange) {
        super(document, range);
        this.nameRange = nameRange;
        this.valueRange = valueRange;
    }
    toString() {
        return "# " + this.getName() + '=' + this.getValue();
    }
    getNameRange() {
        return this.nameRange;
    }
    getValueRange() {
        return this.valueRange;
    }
    getName() {
        return this.document.getText().substring(this.document.offsetAt(this.nameRange.start), this.document.offsetAt(this.nameRange.end));
    }
    getValue() {
        return this.document.getText().substring(this.document.offsetAt(this.valueRange.start), this.document.offsetAt(this.valueRange.end));
    }
    getDirective() {
        const directive = main_1.Directive[this.getName().toLowerCase()];
        return directive === undefined ? null : directive;
    }
}
exports.ParserDirective = ParserDirective;


/***/ }),

/***/ 2965:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const util_1 = __nccwpck_require__(5215);
class Property {
    constructor(document, escapeChar, arg, arg2) {
        this.assignmentOperatorRange = null;
        this.assignmentOperator = null;
        this.valueRange = null;
        this.value = null;
        this.document = document;
        this.escapeChar = escapeChar;
        this.nameRange = Property.getNameRange(document, arg);
        let value = document.getText().substring(document.offsetAt(this.nameRange.start), document.offsetAt(this.nameRange.end));
        this.name = Property.getValue(value, escapeChar);
        if (arg2) {
            this.valueRange = arg2.getRange();
            value = document.getText().substring(document.offsetAt(this.valueRange.start), document.offsetAt(this.valueRange.end));
            this.value = Property.getValue(value, escapeChar);
            this.range = vscode_languageserver_types_1.Range.create(this.nameRange.start, this.valueRange.end);
        }
        else {
            let argRange = arg.getRange();
            if (this.nameRange.start.line === argRange.start.line
                && this.nameRange.start.character === argRange.start.character
                && this.nameRange.end.line === argRange.end.line
                && this.nameRange.end.character === argRange.end.character) {
            }
            else {
                this.valueRange = Property.getValueRange(document, arg);
                value = document.getText().substring(document.offsetAt(this.valueRange.start), document.offsetAt(this.valueRange.end));
                this.value = Property.getValue(value, escapeChar);
                this.assignmentOperatorRange = vscode_languageserver_types_1.Range.create(this.nameRange.end, this.valueRange.start);
                this.assignmentOperator = "=";
            }
            this.range = argRange;
        }
    }
    getRange() {
        return this.range;
    }
    getName() {
        return this.name;
    }
    getNameRange() {
        return this.nameRange;
    }
    getValue() {
        return this.value;
    }
    getValueRange() {
        return this.valueRange;
    }
    /**
     * Retrieves the operator used for delimiting between the name and
     * value of this property. This will either be the "=" character
     * or null if a character was not used or if this property has no
     * value defined.
     */
    getAssignmentOperator() {
        return this.assignmentOperator;
    }
    getAssignmentOperatorRange() {
        return this.assignmentOperatorRange;
    }
    /**
     * Returns the value of this property including any enclosing
     * single or double quotes and relevant escape characters.
     * Escaped newlines and its associated contiguous whitespace
     * characters however will not be returned as they are deemed to
     * be uninteresting to clients trying to return a Dockerfile.
     *
     * @return the unescaped value of this property or null if this
     *         property has no associated value
     */
    getUnescapedValue() {
        if (this.valueRange === null) {
            return null;
        }
        let escaped = false;
        let rawValue = "";
        let value = this.document.getText().substring(this.document.offsetAt(this.valueRange.start), this.document.offsetAt(this.valueRange.end));
        rawLoop: for (let i = 0; i < value.length; i++) {
            let char = value.charAt(i);
            switch (char) {
                case this.escapeChar:
                    for (let j = i + 1; j < value.length; j++) {
                        switch (value.charAt(j)) {
                            case '\r':
                                j++;
                            case '\n':
                                escaped = true;
                                i = j;
                                continue rawLoop;
                            case ' ':
                            case '\t':
                                break;
                            default:
                                rawValue = rawValue + char;
                                continue rawLoop;
                        }
                    }
                    // this happens if there's only whitespace after the escape character
                    rawValue = rawValue + char;
                    break;
                case '\r':
                case '\n':
                    break;
                case ' ':
                case '\t':
                    if (!escaped) {
                        rawValue = rawValue + char;
                    }
                    break;
                case '#':
                    if (escaped) {
                        for (let j = i + 1; j < value.length; j++) {
                            switch (value.charAt(j)) {
                                case '\r':
                                    j++;
                                case '\n':
                                    i = j;
                                    continue rawLoop;
                            }
                        }
                    }
                    else {
                        rawValue = rawValue + char;
                    }
                    break;
                default:
                    rawValue = rawValue + char;
                    escaped = false;
                    break;
            }
        }
        return rawValue;
    }
    static getNameRange(document, arg) {
        let value = arg.getValue();
        let index = value.indexOf('=');
        if (index !== -1) {
            let initial = value.charAt(0);
            let before = value.charAt(index - 1);
            // check if content before the equals sign are in quotes
            // "var"=value
            // 'var'=value
            // otherwise, just assume it's a standard definition
            // var=value
            if ((initial === '"' && before === '"') || (initial === '\'' && before === '\'') || (initial !== '"' && initial !== '\'')) {
                return vscode_languageserver_types_1.Range.create(arg.getRange().start, document.positionAt(document.offsetAt(arg.getRange().start) + index));
            }
        }
        // no '=' found, just defined the property's name
        return arg.getRange();
    }
    static getValueRange(document, arg) {
        return vscode_languageserver_types_1.Range.create(document.positionAt(document.offsetAt(arg.getRange().start) + arg.getValue().indexOf('=') + 1), document.positionAt(document.offsetAt(arg.getRange().end)));
    }
    /**
     * Returns the actual value of this key-value pair. The value will
     * have its escape characters removed if applicable. If the value
     * spans multiple lines and there are comments nested within the
     * lines, they too will be removed.
     *
     * @return the value that this key-value pair will actually be, may
     *         be null if no value is defined, may be the empty string
     *         if the value only consists of whitespace
     */
    static getValue(value, escapeChar) {
        let escaped = false;
        const skip = util_1.Util.findLeadingNonWhitespace(value, escapeChar);
        if (skip !== 0 && value.charAt(skip) === '#') {
            // need to skip over comments
            escaped = true;
        }
        value = value.substring(skip);
        let first = value.charAt(0);
        let last = value.charAt(value.length - 1);
        let literal = first === '\'' || first === '"';
        let inSingle = (first === '\'' && last === '\'');
        let inDouble = false;
        if (first === '"') {
            for (let i = 1; i < value.length; i++) {
                if (value.charAt(i) === escapeChar) {
                    i++;
                }
                else if (value.charAt(i) === '"' && i === value.length - 1) {
                    inDouble = true;
                }
            }
        }
        if (inSingle || inDouble) {
            value = value.substring(1, value.length - 1);
        }
        let commentCheck = -1;
        let escapedValue = "";
        let start = 0;
        parseValue: for (let i = 0; i < value.length; i++) {
            let char = value.charAt(i);
            switch (char) {
                case escapeChar:
                    if (i + 1 === value.length) {
                        escapedValue = escapedValue + escapeChar;
                        break parseValue;
                    }
                    char = value.charAt(i + 1);
                    if (char === ' ' || char === '\t') {
                        whitespaceCheck: for (let j = i + 2; j < value.length; j++) {
                            let char2 = value.charAt(j);
                            switch (char2) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                    j++;
                                case '\n':
                                    escaped = true;
                                    i = j;
                                    continue parseValue;
                                default:
                                    if (!inDouble && !inSingle && !literal) {
                                        if (char2 === escapeChar) {
                                            // add the escaped character
                                            escapedValue = escapedValue + char;
                                            // now start parsing from the next escape character
                                            i = i + 1;
                                        }
                                        else {
                                            // the expectation is that this j = i + 2 here
                                            escapedValue = escapedValue + char + char2;
                                            i = j;
                                        }
                                        continue parseValue;
                                    }
                                    break whitespaceCheck;
                            }
                        }
                    }
                    if (inDouble) {
                        if (char === '\r') {
                            escaped = true;
                            i = i + 2;
                        }
                        else if (char === '\n') {
                            escaped = true;
                            i++;
                        }
                        else if (char !== '"') {
                            if (char === escapeChar) {
                                i++;
                            }
                            escapedValue = escapedValue + escapeChar;
                        }
                        continue parseValue;
                    }
                    else if (inSingle || literal) {
                        if (char === '\r') {
                            escaped = true;
                            i = i + 2;
                        }
                        else if (char === '\n') {
                            escaped = true;
                            i++;
                        }
                        else {
                            escapedValue = escapedValue + escapeChar;
                        }
                        continue parseValue;
                    }
                    else if (char === escapeChar) {
                        // double escape, append one and move on
                        escapedValue = escapedValue + escapeChar;
                        i++;
                    }
                    else if (char === '\r') {
                        escaped = true;
                        // offset one more for \r\n
                        i = i + 2;
                    }
                    else if (char === '\n') {
                        escaped = true;
                        i++;
                        start = i;
                    }
                    else {
                        // any other escapes are simply ignored
                        escapedValue = escapedValue + char;
                        i++;
                    }
                    break;
                case ' ':
                case '\t':
                    if (escaped && commentCheck === -1) {
                        commentCheck = i;
                    }
                    escapedValue = escapedValue + char;
                    break;
                case '\r':
                    i++;
                case '\n':
                    if (escaped && commentCheck !== -1) {
                        // rollback and remove the whitespace that was previously appended
                        escapedValue = escapedValue.substring(0, escapedValue.length - (i - commentCheck - 1));
                        commentCheck = -1;
                    }
                    break;
                case '#':
                    // a newline was escaped and now there's a comment
                    if (escaped) {
                        if (commentCheck !== -1) {
                            // rollback and remove the whitespace that was previously appended
                            escapedValue = escapedValue.substring(0, escapedValue.length - (i - commentCheck));
                            commentCheck = -1;
                        }
                        newlineCheck: for (let j = i + 1; j < value.length; j++) {
                            switch (value.charAt(j)) {
                                case '\r':
                                    j++;
                                case '\n':
                                    i = j;
                                    break newlineCheck;
                            }
                        }
                        continue parseValue;
                    }
                default:
                    if (escaped) {
                        escaped = false;
                        commentCheck = -1;
                    }
                    escapedValue = escapedValue + char;
                    break;
            }
        }
        return escapedValue;
    }
}
exports.Property = Property;


/***/ }),

/***/ 7282:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __nccwpck_require__(5095);
const instruction_1 = __nccwpck_require__(1923);
const property_1 = __nccwpck_require__(2965);
const argument_1 = __nccwpck_require__(5485);
const util_1 = __nccwpck_require__(5215);
class PropertyInstruction extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
        this.properties = undefined;
    }
    getProperties() {
        if (this.properties === undefined) {
            let args = this.getPropertyArguments();
            if (args.length === 0) {
                this.properties = [];
            }
            else if (args.length === 1) {
                this.properties = [new property_1.Property(this.document, this.escapeChar, args[0])];
            }
            else if (args.length === 2) {
                if (args[0].getValue().indexOf('=') === -1) {
                    this.properties = [new property_1.Property(this.document, this.escapeChar, args[0], args[1])];
                }
                else {
                    this.properties = [
                        new property_1.Property(this.document, this.escapeChar, args[0]),
                        new property_1.Property(this.document, this.escapeChar, args[1])
                    ];
                }
            }
            else if (args[0].getValue().indexOf('=') === -1) {
                let text = this.document.getText();
                let start = args[1].getRange().start;
                let end = args[args.length - 1].getRange().end;
                text = text.substring(this.document.offsetAt(start), this.document.offsetAt(end));
                this.properties = [new property_1.Property(this.document, this.escapeChar, args[0], new argument_1.Argument(text, vscode_languageserver_types_1.Range.create(args[1].getRange().start, args[args.length - 1].getRange().end)))];
            }
            else {
                this.properties = [];
                for (let i = 0; i < args.length; i++) {
                    this.properties.push(new property_1.Property(this.document, this.escapeChar, args[i]));
                }
            }
        }
        return this.properties;
    }
    /**
     * Goes from the back of the string and returns the first
     * non-whitespace character that is found. If an escape character
     * is found with newline characters, the escape character will
     * not be considered a non-whitespace character and its index in
     * the string will not be returned.
     *
     * @param content the string to search through
     * @return the index in the string for the first non-whitespace
     *         character when searching from the end of the string
     */
    findTrailingNonWhitespace(content) {
        // loop back to find the first non-whitespace character
        let index = content.length;
        whitespaceCheck: for (let i = content.length - 1; i >= 0; i--) {
            switch (content.charAt(i)) {
                case ' ':
                case '\t':
                    continue;
                case '\n':
                    if (content.charAt(i - 1) === '\r') {
                        i = i - 1;
                    }
                case '\r':
                    newlineCheck: for (let j = i - 1; j >= 0; j--) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                            case '\r':
                            case '\n':
                            case this.escapeChar:
                                continue;
                            default:
                                index = j;
                                break newlineCheck;
                        }
                    }
                    break whitespaceCheck;
                default:
                    index = i;
                    break whitespaceCheck;
            }
        }
        return index;
    }
    getPropertyArguments() {
        const args = [];
        let range = this.getInstructionRange();
        let instructionNameEndOffset = this.document.offsetAt(range.end);
        let extra = instructionNameEndOffset - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra);
        let start = util_1.Util.findLeadingNonWhitespace(fullArgs, this.escapeChar);
        if (start === -1) {
            // only whitespace found, no arguments
            return [];
        }
        const startPosition = this.document.positionAt(instructionNameEndOffset + start);
        // records whether the parser has just processed an escaped newline or not,
        // if our starting position is not on the same line as the instruction then
        // the start of the content is already on an escaped line
        let escaped = range.start.line !== startPosition.line;
        // flag to track if the last character was an escape character
        let endingEscape = false;
        // position before the first escape character was hit
        let mark = -1;
        let end = this.findTrailingNonWhitespace(fullArgs);
        content = fullArgs.substring(start, end + 1);
        let argStart = escaped ? -1 : 0;
        let spaced = false;
        argumentLoop: for (let i = 0; i < content.length; i++) {
            let char = content.charAt(i);
            switch (char) {
                case this.escapeChar:
                    if (i + 1 === content.length) {
                        endingEscape = true;
                        break argumentLoop;
                    }
                    if (!escaped) {
                        mark = i;
                    }
                    switch (content.charAt(i + 1)) {
                        case ' ':
                        case '\t':
                            if (!util_1.Util.isWhitespace(content.charAt(i + 2))) {
                                // space was escaped, continue as normal
                                i = i + 1;
                                continue argumentLoop;
                            }
                            // whitespace encountered, need to figure out if it extends to EOL
                            whitespaceCheck: for (let j = i + 2; j < content.length; j++) {
                                switch (content.charAt(j)) {
                                    case '\r':
                                        // offset one more for \r\n
                                        j++;
                                    case '\n':
                                        // whitespace only, safe to skip
                                        escaped = true;
                                        i = j;
                                        continue argumentLoop;
                                    case ' ':
                                    case '\t':
                                        // ignore whitespace
                                        break;
                                    default:
                                        // whitespace doesn't extend to EOL, create an argument
                                        args.push(new argument_1.Argument(content.substring(argStart, i), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + i + 2))));
                                        argStart = j;
                                        break whitespaceCheck;
                                }
                            }
                            // go back and start processing the encountered non-whitespace character
                            i = argStart - 1;
                            continue argumentLoop;
                        case '\r':
                            // offset one more for \r\n
                            i++;
                        case '\n':
                            // immediately followed by a newline, skip the newline
                            escaped = true;
                            i = i + 1;
                            continue argumentLoop;
                        case this.escapeChar:
                            // double escape found, skip it and move on
                            if (argStart === -1) {
                                argStart = i;
                            }
                            i = i + 1;
                            continue argumentLoop;
                        default:
                            if (argStart === -1) {
                                argStart = i;
                            }
                            // non-whitespace encountered, skip the escape and process the
                            // character normally
                            continue argumentLoop;
                    }
                case '\'':
                case '"':
                    if (spaced) {
                        this.createSpacedArgument(argStart, args, content, mark, instructionNameEndOffset, start);
                        // reset to start a new argument
                        argStart = i;
                        spaced = false;
                    }
                    if (argStart === -1) {
                        argStart = i;
                    }
                    for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case char:
                                if (content.charAt(j + 1) !== ' ' && content.charAt(j + 1) !== '') {
                                    // there is more content after this quote,
                                    // continue so that it is all processed as
                                    // one single argument
                                    i = j;
                                    continue argumentLoop;
                                }
                                args.push(new argument_1.Argument(content.substring(argStart, j + 1), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + j + 1))));
                                i = j;
                                argStart = -1;
                                continue argumentLoop;
                            case this.escapeChar:
                                j++;
                                break;
                        }
                    }
                    break argumentLoop;
                case ' ':
                case '\t':
                    if (escaped) {
                        // consider there to be a space only if an argument
                        // is not spanning multiple lines
                        if (argStart !== -1) {
                            spaced = true;
                        }
                    }
                    else if (argStart !== -1) {
                        args.push(new argument_1.Argument(content.substring(argStart, i), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + i))));
                        argStart = -1;
                    }
                    break;
                case '\r':
                    // offset one more for \r\n
                    i++;
                case '\n':
                    spaced = false;
                    break;
                case '#':
                    if (escaped) {
                        // a newline was escaped and now there's a comment
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case '\r':
                                    j++;
                                case '\n':
                                    i = j;
                                    spaced = false;
                                    continue argumentLoop;
                            }
                        }
                        // went to the end without finding a newline,
                        // the comment was the last line in the instruction,
                        // just stop parsing, create an argument if needed
                        if (argStart !== -1) {
                            let value = content.substring(argStart, mark);
                            args.push(new argument_1.Argument(value, vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + mark))));
                            argStart = -1;
                        }
                        break argumentLoop;
                    }
                    else if (argStart === -1) {
                        argStart = i;
                    }
                    break;
                default:
                    if (spaced) {
                        this.createSpacedArgument(argStart, args, content, mark, instructionNameEndOffset, start);
                        // reset to start a new argument
                        argStart = i;
                        spaced = false;
                    }
                    escaped = false;
                    if (argStart === -1) {
                        argStart = i;
                    }
                    // variable detected
                    if (char === '$' && content.charAt(i + 1) === '{') {
                        let singleQuotes = false;
                        let doubleQuotes = false;
                        let escaped = false;
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case this.escapeChar:
                                    escaped = true;
                                    break;
                                case '\r':
                                case '\n':
                                    break;
                                case '\'':
                                    singleQuotes = !singleQuotes;
                                    escaped = false;
                                    break;
                                case '"':
                                    doubleQuotes = !doubleQuotes;
                                    escaped = false;
                                    break;
                                case ' ':
                                case '\t':
                                    if (escaped || singleQuotes || doubleQuotes) {
                                        break;
                                    }
                                    i = j - 1;
                                    continue argumentLoop;
                                case '}':
                                    i = j;
                                    continue argumentLoop;
                                default:
                                    escaped = false;
                                    break;
                            }
                        }
                        break argumentLoop;
                    }
                    break;
            }
        }
        if (argStart !== -1 && argStart !== content.length) {
            let end = endingEscape ? content.length - 1 : content.length;
            let value = content.substring(argStart, end);
            args.push(new argument_1.Argument(value, vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + end))));
        }
        return args;
    }
    createSpacedArgument(argStart, args, content, mark, instructionNameEndOffset, start) {
        if (argStart !== -1) {
            args.push(new argument_1.Argument(content.substring(argStart, mark), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + mark))));
        }
    }
}
exports.PropertyInstruction = PropertyInstruction;


/***/ }),

/***/ 5215:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Util {
    static isWhitespace(char) {
        return char === ' ' || char === '\t' || Util.isNewline(char);
    }
    static isNewline(char) {
        return char === '\r' || char === '\n';
    }
    static findLeadingNonWhitespace(content, escapeChar) {
        whitespaceCheck: for (let i = 0; i < content.length; i++) {
            switch (content.charAt(i)) {
                case ' ':
                case '\t':
                    continue;
                case escapeChar:
                    escapeCheck: for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                // offset one more for \r\n
                                i = j + 1;
                                continue whitespaceCheck;
                            case '\n':
                                i = j;
                                continue whitespaceCheck;
                            default:
                                break escapeCheck;
                        }
                    }
                    // found an escape character and then reached EOF
                    return -1;
                default:
                    return i;
            }
        }
        // only possible if the content is the empty string
        return -1;
    }
    /**
     * Determines if the given position is contained within the given range.
     *
     * @param position the position to check
     * @param range the range to see if the position is inside of
     */
    static isInsideRange(position, range) {
        if (range.start.line === range.end.line) {
            return range.start.line === position.line
                && range.start.character <= position.character
                && position.character <= range.end.character;
        }
        else if (range.start.line === position.line) {
            return range.start.character <= position.character;
        }
        else if (range.end.line === position.line) {
            return position.character <= range.end.character;
        }
        return range.start.line < position.line && position.line < range.end.line;
    }
}
exports.Util = Util;


/***/ }),

/***/ 7884:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Variable {
    constructor(name, nameRange, range, modifier, modifierRange, substitutionParameter, substitutionRange, defined, buildVariable, stringValue) {
        this.name = name;
        this.nameRange = nameRange;
        this.range = range;
        this.modifier = modifier;
        this.modifierRange = modifierRange;
        this.substitutionParameter = substitutionParameter;
        this.substitutionRange = substitutionRange;
        this.defined = defined;
        this.buildVariable = buildVariable;
        this.stringValue = stringValue;
    }
    toString() {
        return this.stringValue;
    }
    getName() {
        return this.name;
    }
    getNameRange() {
        return this.nameRange;
    }
    /**
     * Returns the range of the entire variable. This includes the symbols for
     * the declaration of the variable such as the $, {, and } symbols.
     *
     * @return the range in the document that this variable encompasses in its
     *         entirety
     */
    getRange() {
        return this.range;
    }
    /**
     * Returns the modifier character that has been set for
     * specifying how this variable should be expanded and resolved.
     * If this variable is ${variable:+value} then the modifier
     * character is '+'. Will be the empty string if the variable is
     * declared as ${variable:}. Otherwise, will be null if this
     * variable will not use variable substitution at all (such as
     * ${variable} or $variable).
     *
     * @return this variable's modifier character, or the empty
     *         string if it does not have one, or null if this
     *         variable will not use variable substitution
     */
    getModifier() {
        return this.modifier;
    }
    getModifierRange() {
        return this.modifierRange;
    }
    /**
     * Returns the parameter that will be used for substitution if
     * this variable uses modifiers to define how its value should be
     * resolved. If this variable is ${variable:+value} then the
     * substitution value will be 'value'. Will be the empty string
     * if the variable is declared as ${variable:+} or some other
     * variant where the only thing that follows the modifier
     * character (excluding considerations of escape characters and
     * so on) is the variable's closing bracket. May be null if this
     * variable does not have a modifier character defined (such as
     * ${variable} or $variable).
     *
     * @return this variable's substitution parameter, or the empty
     *         string if it does not have one, or null if there is
     *         not one defined
     */
    getSubstitutionParameter() {
        return this.substitutionParameter;
    }
    getSubstitutionRange() {
        return this.substitutionRange;
    }
    /**
     * Returns whether this variable has been defined or not.
     *
     * @return true if this variable has been defined, false otherwise
     */
    isDefined() {
        return this.defined;
    }
    isBuildVariable() {
        return this.buildVariable === true;
    }
    isEnvironmentVariable() {
        return this.buildVariable === false;
    }
}
exports.Variable = Variable;


/***/ }),

/***/ 6863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __nccwpck_require__(5747)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __nccwpck_require__(1734)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 1734:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __nccwpck_require__(5622);
var isWindows = process.platform === 'win32';
var fs = __nccwpck_require__(5747);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 7625:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __nccwpck_require__(5622)
var minimatch = __nccwpck_require__(3973)
var isAbsolute = __nccwpck_require__(8714)
var Minimatch = minimatch.Minimatch

function alphasort (a, b) {
  return a.localeCompare(b, 'en')
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 1957:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __nccwpck_require__(5747)
var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var inherits = __nccwpck_require__(4124)
var EE = __nccwpck_require__(8614).EventEmitter
var path = __nccwpck_require__(5622)
var assert = __nccwpck_require__(2357)
var isAbsolute = __nccwpck_require__(8714)
var globSync = __nccwpck_require__(9010)
var common = __nccwpck_require__(7625)
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __nccwpck_require__(2492)
var util = __nccwpck_require__(1669)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __nccwpck_require__(1223)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 9010:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __nccwpck_require__(5747)
var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var Glob = __nccwpck_require__(1957).Glob
var util = __nccwpck_require__(1669)
var path = __nccwpck_require__(5622)
var assert = __nccwpck_require__(2357)
var isAbsolute = __nccwpck_require__(8714)
var common = __nccwpck_require__(7625)
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 2492:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
var reqs = Object.create(null)
var once = __nccwpck_require__(1223)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(1669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __nccwpck_require__(5622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 8714:
/***/ ((module) => {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 933:
/***/ ((module, exports) => {

(function (factory) {
    if ( true && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function () {
    /* --------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation. All rights reserved.
     * Licensed under the MIT License. See License.txt in the project root for license information.
     * ------------------------------------------------------------------------------------------ */
    'use strict';
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    var FullTextDocument = /** @class */ (function () {
        function FullTextDocument(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = undefined;
        }
        Object.defineProperty(FullTextDocument.prototype, "uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "languageId", {
            get: function () {
                return this._languageId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        FullTextDocument.prototype.getText = function (range) {
            if (range) {
                var start = this.offsetAt(range.start);
                var end = this.offsetAt(range.end);
                return this._content.substring(start, end);
            }
            return this._content;
        };
        FullTextDocument.prototype.update = function (changes, version) {
            for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
                var change = changes_1[_i];
                if (FullTextDocument.isIncremental(change)) {
                    // makes sure start is before end
                    var range = getWellformedRange(change.range);
                    // update content
                    var startOffset = this.offsetAt(range.start);
                    var endOffset = this.offsetAt(range.end);
                    this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
                    // update the offsets
                    var startLine = Math.max(range.start.line, 0);
                    var endLine = Math.max(range.end.line, 0);
                    var lineOffsets = this._lineOffsets;
                    var addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
                    if (endLine - startLine === addedLineOffsets.length) {
                        for (var i = 0, len = addedLineOffsets.length; i < len; i++) {
                            lineOffsets[i + startLine + 1] = addedLineOffsets[i];
                        }
                    }
                    else {
                        if (addedLineOffsets.length < 10000) {
                            lineOffsets.splice.apply(lineOffsets, [startLine + 1, endLine - startLine].concat(addedLineOffsets));
                        }
                        else { // avoid too many arguments for splice
                            this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
                        }
                    }
                    var diff = change.text.length - (endOffset - startOffset);
                    if (diff !== 0) {
                        for (var i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) {
                            lineOffsets[i] = lineOffsets[i] + diff;
                        }
                    }
                }
                else if (FullTextDocument.isFull(change)) {
                    this._content = change.text;
                    this._lineOffsets = undefined;
                }
                else {
                    throw new Error('Unknown change event received');
                }
            }
            this._version = version;
        };
        FullTextDocument.prototype.getLineOffsets = function () {
            if (this._lineOffsets === undefined) {
                this._lineOffsets = computeLineOffsets(this._content, true);
            }
            return this._lineOffsets;
        };
        FullTextDocument.prototype.positionAt = function (offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
                return { line: 0, character: offset };
            }
            while (low < high) {
                var mid = Math.floor((low + high) / 2);
                if (lineOffsets[mid] > offset) {
                    high = mid;
                }
                else {
                    low = mid + 1;
                }
            }
            // low is the least x for which the line offset is larger than the current offset
            // or array.length if no line offset is larger than the current offset
            var line = low - 1;
            return { line: line, character: offset - lineOffsets[line] };
        };
        FullTextDocument.prototype.offsetAt = function (position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
                return this._content.length;
            }
            else if (position.line < 0) {
                return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = (position.line + 1 < lineOffsets.length) ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
        };
        Object.defineProperty(FullTextDocument.prototype, "lineCount", {
            get: function () {
                return this.getLineOffsets().length;
            },
            enumerable: true,
            configurable: true
        });
        FullTextDocument.isIncremental = function (event) {
            var candidate = event;
            return candidate !== undefined && candidate !== null &&
                typeof candidate.text === 'string' && candidate.range !== undefined &&
                (candidate.rangeLength === undefined || typeof candidate.rangeLength === 'number');
        };
        FullTextDocument.isFull = function (event) {
            var candidate = event;
            return candidate !== undefined && candidate !== null &&
                typeof candidate.text === 'string' && candidate.range === undefined && candidate.rangeLength === undefined;
        };
        return FullTextDocument;
    }());
    var TextDocument;
    (function (TextDocument) {
        /**
         * Creates a new text document.
         *
         * @param uri The document's uri.
         * @param languageId  The document's language Id.
         * @param version The document's initial version number.
         * @param content The document's content.
         */
        function create(uri, languageId, version, content) {
            return new FullTextDocument(uri, languageId, version, content);
        }
        TextDocument.create = create;
        /**
         * Updates a TextDocument by modifing its content.
         *
         * @param document the document to update. Only documents created by TextDocument.create are valid inputs.
         * @param changes the changes to apply to the document.
         * @returns The updated TextDocument. Note: That's the same document instance passed in as first parameter.
         *
         */
        function update(document, changes, version) {
            if (document instanceof FullTextDocument) {
                document.update(changes, version);
                return document;
            }
            else {
                throw new Error('TextDocument.update: document must be created by TextDocument.create');
            }
        }
        TextDocument.update = update;
        function applyEdits(document, edits) {
            var text = document.getText();
            var sortedEdits = mergeSort(edits.map(getWellformedEdit), function (a, b) {
                var diff = a.range.start.line - b.range.start.line;
                if (diff === 0) {
                    return a.range.start.character - b.range.start.character;
                }
                return diff;
            });
            var lastModifiedOffset = 0;
            var spans = [];
            for (var _i = 0, sortedEdits_1 = sortedEdits; _i < sortedEdits_1.length; _i++) {
                var e = sortedEdits_1[_i];
                var startOffset = document.offsetAt(e.range.start);
                if (startOffset < lastModifiedOffset) {
                    throw new Error('Overlapping edit');
                }
                else if (startOffset > lastModifiedOffset) {
                    spans.push(text.substring(lastModifiedOffset, startOffset));
                }
                if (e.newText.length) {
                    spans.push(e.newText);
                }
                lastModifiedOffset = document.offsetAt(e.range.end);
            }
            spans.push(text.substr(lastModifiedOffset));
            return spans.join('');
        }
        TextDocument.applyEdits = applyEdits;
    })(TextDocument = exports.TextDocument || (exports.TextDocument = {}));
    function mergeSort(data, compare) {
        if (data.length <= 1) {
            // sorted
            return data;
        }
        var p = (data.length / 2) | 0;
        var left = data.slice(0, p);
        var right = data.slice(p);
        mergeSort(left, compare);
        mergeSort(right, compare);
        var leftIdx = 0;
        var rightIdx = 0;
        var i = 0;
        while (leftIdx < left.length && rightIdx < right.length) {
            var ret = compare(left[leftIdx], right[rightIdx]);
            if (ret <= 0) {
                // smaller_equal -> take left to preserve order
                data[i++] = left[leftIdx++];
            }
            else {
                // greater -> take right
                data[i++] = right[rightIdx++];
            }
        }
        while (leftIdx < left.length) {
            data[i++] = left[leftIdx++];
        }
        while (rightIdx < right.length) {
            data[i++] = right[rightIdx++];
        }
        return data;
    }
    function computeLineOffsets(text, isAtLineStart, textOffset) {
        if (textOffset === void 0) { textOffset = 0; }
        var result = isAtLineStart ? [textOffset] : [];
        for (var i = 0; i < text.length; i++) {
            var ch = text.charCodeAt(i);
            if (ch === 13 /* CarriageReturn */ || ch === 10 /* LineFeed */) {
                if (ch === 13 /* CarriageReturn */ && i + 1 < text.length && text.charCodeAt(i + 1) === 10 /* LineFeed */) {
                    i++;
                }
                result.push(textOffset + i + 1);
            }
        }
        return result;
    }
    function getWellformedRange(range) {
        var start = range.start;
        var end = range.end;
        if (start.line > end.line || (start.line === end.line && start.character > end.character)) {
            return { start: end, end: start };
        }
        return range;
    }
    function getWellformedEdit(textEdit) {
        var range = getWellformedRange(textEdit.range);
        if (range !== textEdit.range) {
            return { newText: textEdit.newText, range: range };
        }
        return textEdit;
    }
});


/***/ }),

/***/ 5095:
/***/ ((module, exports) => {

(function (factory) {
    if ( true && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function () {
    /* --------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation. All rights reserved.
     * Licensed under the MIT License. See License.txt in the project root for license information.
     * ------------------------------------------------------------------------------------------ */
    'use strict';
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.TextDocument = exports.EOL = exports.SemanticTokens = exports.SemanticTokenModifiers = exports.SemanticTokenTypes = exports.SelectionRange = exports.DocumentLink = exports.FormattingOptions = exports.CodeLens = exports.CodeAction = exports.CodeActionContext = exports.CodeActionKind = exports.DocumentSymbol = exports.SymbolInformation = exports.SymbolTag = exports.SymbolKind = exports.DocumentHighlight = exports.DocumentHighlightKind = exports.SignatureInformation = exports.ParameterInformation = exports.Hover = exports.MarkedString = exports.CompletionList = exports.CompletionItem = exports.CompletionItemLabelDetails = exports.InsertTextMode = exports.InsertReplaceEdit = exports.CompletionItemTag = exports.InsertTextFormat = exports.CompletionItemKind = exports.MarkupContent = exports.MarkupKind = exports.TextDocumentItem = exports.OptionalVersionedTextDocumentIdentifier = exports.VersionedTextDocumentIdentifier = exports.TextDocumentIdentifier = exports.WorkspaceChange = exports.WorkspaceEdit = exports.DeleteFile = exports.RenameFile = exports.CreateFile = exports.TextDocumentEdit = exports.AnnotatedTextEdit = exports.ChangeAnnotationIdentifier = exports.ChangeAnnotation = exports.TextEdit = exports.Command = exports.Diagnostic = exports.CodeDescription = exports.DiagnosticTag = exports.DiagnosticSeverity = exports.DiagnosticRelatedInformation = exports.FoldingRange = exports.FoldingRangeKind = exports.ColorPresentation = exports.ColorInformation = exports.Color = exports.LocationLink = exports.Location = exports.Range = exports.Position = exports.uinteger = exports.integer = void 0;
    var integer;
    (function (integer) {
        integer.MIN_VALUE = -2147483648;
        integer.MAX_VALUE = 2147483647;
    })(integer = exports.integer || (exports.integer = {}));
    var uinteger;
    (function (uinteger) {
        uinteger.MIN_VALUE = 0;
        uinteger.MAX_VALUE = 2147483647;
    })(uinteger = exports.uinteger || (exports.uinteger = {}));
    /**
     * The Position namespace provides helper functions to work with
     * [Position](#Position) literals.
     */
    var Position;
    (function (Position) {
        /**
         * Creates a new Position literal from the given line and character.
         * @param line The position's line.
         * @param character The position's character.
         */
        function create(line, character) {
            if (line === Number.MAX_VALUE) {
                line = uinteger.MAX_VALUE;
            }
            if (character === Number.MAX_VALUE) {
                character = uinteger.MAX_VALUE;
            }
            return { line: line, character: character };
        }
        Position.create = create;
        /**
         * Checks whether the given literal conforms to the [Position](#Position) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
        }
        Position.is = is;
    })(Position = exports.Position || (exports.Position = {}));
    /**
     * The Range namespace provides helper functions to work with
     * [Range](#Range) literals.
     */
    var Range;
    (function (Range) {
        function create(one, two, three, four) {
            if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
                return { start: Position.create(one, two), end: Position.create(three, four) };
            }
            else if (Position.is(one) && Position.is(two)) {
                return { start: one, end: two };
            }
            else {
                throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
            }
        }
        Range.create = create;
        /**
         * Checks whether the given literal conforms to the [Range](#Range) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
        }
        Range.is = is;
    })(Range = exports.Range || (exports.Range = {}));
    /**
     * The Location namespace provides helper functions to work with
     * [Location](#Location) literals.
     */
    var Location;
    (function (Location) {
        /**
         * Creates a Location literal.
         * @param uri The location's uri.
         * @param range The location's range.
         */
        function create(uri, range) {
            return { uri: uri, range: range };
        }
        Location.create = create;
        /**
         * Checks whether the given literal conforms to the [Location](#Location) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
        }
        Location.is = is;
    })(Location = exports.Location || (exports.Location = {}));
    /**
     * The LocationLink namespace provides helper functions to work with
     * [LocationLink](#LocationLink) literals.
     */
    var LocationLink;
    (function (LocationLink) {
        /**
         * Creates a LocationLink literal.
         * @param targetUri The definition's uri.
         * @param targetRange The full range of the definition.
         * @param targetSelectionRange The span of the symbol definition at the target.
         * @param originSelectionRange The span of the symbol being defined in the originating source file.
         */
        function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
            return { targetUri: targetUri, targetRange: targetRange, targetSelectionRange: targetSelectionRange, originSelectionRange: originSelectionRange };
        }
        LocationLink.create = create;
        /**
         * Checks whether the given literal conforms to the [LocationLink](#LocationLink) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri)
                && (Range.is(candidate.targetSelectionRange) || Is.undefined(candidate.targetSelectionRange))
                && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
        }
        LocationLink.is = is;
    })(LocationLink = exports.LocationLink || (exports.LocationLink = {}));
    /**
     * The Color namespace provides helper functions to work with
     * [Color](#Color) literals.
     */
    var Color;
    (function (Color) {
        /**
         * Creates a new Color literal.
         */
        function create(red, green, blue, alpha) {
            return {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha,
            };
        }
        Color.create = create;
        /**
         * Checks whether the given literal conforms to the [Color](#Color) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.numberRange(candidate.red, 0, 1)
                && Is.numberRange(candidate.green, 0, 1)
                && Is.numberRange(candidate.blue, 0, 1)
                && Is.numberRange(candidate.alpha, 0, 1);
        }
        Color.is = is;
    })(Color = exports.Color || (exports.Color = {}));
    /**
     * The ColorInformation namespace provides helper functions to work with
     * [ColorInformation](#ColorInformation) literals.
     */
    var ColorInformation;
    (function (ColorInformation) {
        /**
         * Creates a new ColorInformation literal.
         */
        function create(range, color) {
            return {
                range: range,
                color: color,
            };
        }
        ColorInformation.create = create;
        /**
         * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
         */
        function is(value) {
            var candidate = value;
            return Range.is(candidate.range) && Color.is(candidate.color);
        }
        ColorInformation.is = is;
    })(ColorInformation = exports.ColorInformation || (exports.ColorInformation = {}));
    /**
     * The Color namespace provides helper functions to work with
     * [ColorPresentation](#ColorPresentation) literals.
     */
    var ColorPresentation;
    (function (ColorPresentation) {
        /**
         * Creates a new ColorInformation literal.
         */
        function create(label, textEdit, additionalTextEdits) {
            return {
                label: label,
                textEdit: textEdit,
                additionalTextEdits: additionalTextEdits,
            };
        }
        ColorPresentation.create = create;
        /**
         * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.string(candidate.label)
                && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate))
                && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
        }
        ColorPresentation.is = is;
    })(ColorPresentation = exports.ColorPresentation || (exports.ColorPresentation = {}));
    /**
     * Enum of known range kinds
     */
    var FoldingRangeKind;
    (function (FoldingRangeKind) {
        /**
         * Folding range for a comment
         */
        FoldingRangeKind["Comment"] = "comment";
        /**
         * Folding range for a imports or includes
         */
        FoldingRangeKind["Imports"] = "imports";
        /**
         * Folding range for a region (e.g. `#region`)
         */
        FoldingRangeKind["Region"] = "region";
    })(FoldingRangeKind = exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
    /**
     * The folding range namespace provides helper functions to work with
     * [FoldingRange](#FoldingRange) literals.
     */
    var FoldingRange;
    (function (FoldingRange) {
        /**
         * Creates a new FoldingRange literal.
         */
        function create(startLine, endLine, startCharacter, endCharacter, kind) {
            var result = {
                startLine: startLine,
                endLine: endLine
            };
            if (Is.defined(startCharacter)) {
                result.startCharacter = startCharacter;
            }
            if (Is.defined(endCharacter)) {
                result.endCharacter = endCharacter;
            }
            if (Is.defined(kind)) {
                result.kind = kind;
            }
            return result;
        }
        FoldingRange.create = create;
        /**
         * Checks whether the given literal conforms to the [FoldingRange](#FoldingRange) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine)
                && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter))
                && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter))
                && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
        }
        FoldingRange.is = is;
    })(FoldingRange = exports.FoldingRange || (exports.FoldingRange = {}));
    /**
     * The DiagnosticRelatedInformation namespace provides helper functions to work with
     * [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) literals.
     */
    var DiagnosticRelatedInformation;
    (function (DiagnosticRelatedInformation) {
        /**
         * Creates a new DiagnosticRelatedInformation literal.
         */
        function create(location, message) {
            return {
                location: location,
                message: message
            };
        }
        DiagnosticRelatedInformation.create = create;
        /**
         * Checks whether the given literal conforms to the [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
        }
        DiagnosticRelatedInformation.is = is;
    })(DiagnosticRelatedInformation = exports.DiagnosticRelatedInformation || (exports.DiagnosticRelatedInformation = {}));
    /**
     * The diagnostic's severity.
     */
    var DiagnosticSeverity;
    (function (DiagnosticSeverity) {
        /**
         * Reports an error.
         */
        DiagnosticSeverity.Error = 1;
        /**
         * Reports a warning.
         */
        DiagnosticSeverity.Warning = 2;
        /**
         * Reports an information.
         */
        DiagnosticSeverity.Information = 3;
        /**
         * Reports a hint.
         */
        DiagnosticSeverity.Hint = 4;
    })(DiagnosticSeverity = exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
    /**
     * The diagnostic tags.
     *
     * @since 3.15.0
     */
    var DiagnosticTag;
    (function (DiagnosticTag) {
        /**
         * Unused or unnecessary code.
         *
         * Clients are allowed to render diagnostics with this tag faded out instead of having
         * an error squiggle.
         */
        DiagnosticTag.Unnecessary = 1;
        /**
         * Deprecated or obsolete code.
         *
         * Clients are allowed to rendered diagnostics with this tag strike through.
         */
        DiagnosticTag.Deprecated = 2;
    })(DiagnosticTag = exports.DiagnosticTag || (exports.DiagnosticTag = {}));
    /**
     * The CodeDescription namespace provides functions to deal with descriptions for diagnostic codes.
     *
     * @since 3.16.0
     */
    var CodeDescription;
    (function (CodeDescription) {
        function is(value) {
            var candidate = value;
            return candidate !== undefined && candidate !== null && Is.string(candidate.href);
        }
        CodeDescription.is = is;
    })(CodeDescription = exports.CodeDescription || (exports.CodeDescription = {}));
    /**
     * The Diagnostic namespace provides helper functions to work with
     * [Diagnostic](#Diagnostic) literals.
     */
    var Diagnostic;
    (function (Diagnostic) {
        /**
         * Creates a new Diagnostic literal.
         */
        function create(range, message, severity, code, source, relatedInformation) {
            var result = { range: range, message: message };
            if (Is.defined(severity)) {
                result.severity = severity;
            }
            if (Is.defined(code)) {
                result.code = code;
            }
            if (Is.defined(source)) {
                result.source = source;
            }
            if (Is.defined(relatedInformation)) {
                result.relatedInformation = relatedInformation;
            }
            return result;
        }
        Diagnostic.create = create;
        /**
         * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
         */
        function is(value) {
            var _a;
            var candidate = value;
            return Is.defined(candidate)
                && Range.is(candidate.range)
                && Is.string(candidate.message)
                && (Is.number(candidate.severity) || Is.undefined(candidate.severity))
                && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code))
                && (Is.undefined(candidate.codeDescription) || (Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)))
                && (Is.string(candidate.source) || Is.undefined(candidate.source))
                && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
        }
        Diagnostic.is = is;
    })(Diagnostic = exports.Diagnostic || (exports.Diagnostic = {}));
    /**
     * The Command namespace provides helper functions to work with
     * [Command](#Command) literals.
     */
    var Command;
    (function (Command) {
        /**
         * Creates a new Command literal.
         */
        function create(title, command) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result = { title: title, command: command };
            if (Is.defined(args) && args.length > 0) {
                result.arguments = args;
            }
            return result;
        }
        Command.create = create;
        /**
         * Checks whether the given literal conforms to the [Command](#Command) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
        }
        Command.is = is;
    })(Command = exports.Command || (exports.Command = {}));
    /**
     * The TextEdit namespace provides helper function to create replace,
     * insert and delete edits more easily.
     */
    var TextEdit;
    (function (TextEdit) {
        /**
         * Creates a replace text edit.
         * @param range The range of text to be replaced.
         * @param newText The new text.
         */
        function replace(range, newText) {
            return { range: range, newText: newText };
        }
        TextEdit.replace = replace;
        /**
         * Creates a insert text edit.
         * @param position The position to insert the text at.
         * @param newText The text to be inserted.
         */
        function insert(position, newText) {
            return { range: { start: position, end: position }, newText: newText };
        }
        TextEdit.insert = insert;
        /**
         * Creates a delete text edit.
         * @param range The range of text to be deleted.
         */
        function del(range) {
            return { range: range, newText: '' };
        }
        TextEdit.del = del;
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate)
                && Is.string(candidate.newText)
                && Range.is(candidate.range);
        }
        TextEdit.is = is;
    })(TextEdit = exports.TextEdit || (exports.TextEdit = {}));
    var ChangeAnnotation;
    (function (ChangeAnnotation) {
        function create(label, needsConfirmation, description) {
            var result = { label: label };
            if (needsConfirmation !== undefined) {
                result.needsConfirmation = needsConfirmation;
            }
            if (description !== undefined) {
                result.description = description;
            }
            return result;
        }
        ChangeAnnotation.create = create;
        function is(value) {
            var candidate = value;
            return candidate !== undefined && Is.objectLiteral(candidate) && Is.string(candidate.label) &&
                (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === undefined) &&
                (Is.string(candidate.description) || candidate.description === undefined);
        }
        ChangeAnnotation.is = is;
    })(ChangeAnnotation = exports.ChangeAnnotation || (exports.ChangeAnnotation = {}));
    var ChangeAnnotationIdentifier;
    (function (ChangeAnnotationIdentifier) {
        function is(value) {
            var candidate = value;
            return typeof candidate === 'string';
        }
        ChangeAnnotationIdentifier.is = is;
    })(ChangeAnnotationIdentifier = exports.ChangeAnnotationIdentifier || (exports.ChangeAnnotationIdentifier = {}));
    var AnnotatedTextEdit;
    (function (AnnotatedTextEdit) {
        /**
         * Creates an annotated replace text edit.
         *
         * @param range The range of text to be replaced.
         * @param newText The new text.
         * @param annotation The annotation.
         */
        function replace(range, newText, annotation) {
            return { range: range, newText: newText, annotationId: annotation };
        }
        AnnotatedTextEdit.replace = replace;
        /**
         * Creates an annotated insert text edit.
         *
         * @param position The position to insert the text at.
         * @param newText The text to be inserted.
         * @param annotation The annotation.
         */
        function insert(position, newText, annotation) {
            return { range: { start: position, end: position }, newText: newText, annotationId: annotation };
        }
        AnnotatedTextEdit.insert = insert;
        /**
         * Creates an annotated delete text edit.
         *
         * @param range The range of text to be deleted.
         * @param annotation The annotation.
         */
        function del(range, annotation) {
            return { range: range, newText: '', annotationId: annotation };
        }
        AnnotatedTextEdit.del = del;
        function is(value) {
            var candidate = value;
            return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        AnnotatedTextEdit.is = is;
    })(AnnotatedTextEdit = exports.AnnotatedTextEdit || (exports.AnnotatedTextEdit = {}));
    /**
     * The TextDocumentEdit namespace provides helper function to create
     * an edit that manipulates a text document.
     */
    var TextDocumentEdit;
    (function (TextDocumentEdit) {
        /**
         * Creates a new `TextDocumentEdit`
         */
        function create(textDocument, edits) {
            return { textDocument: textDocument, edits: edits };
        }
        TextDocumentEdit.create = create;
        function is(value) {
            var candidate = value;
            return Is.defined(candidate)
                && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument)
                && Array.isArray(candidate.edits);
        }
        TextDocumentEdit.is = is;
    })(TextDocumentEdit = exports.TextDocumentEdit || (exports.TextDocumentEdit = {}));
    var CreateFile;
    (function (CreateFile) {
        function create(uri, options, annotation) {
            var result = {
                kind: 'create',
                uri: uri
            };
            if (options !== undefined && (options.overwrite !== undefined || options.ignoreIfExists !== undefined)) {
                result.options = options;
            }
            if (annotation !== undefined) {
                result.annotationId = annotation;
            }
            return result;
        }
        CreateFile.create = create;
        function is(value) {
            var candidate = value;
            return candidate && candidate.kind === 'create' && Is.string(candidate.uri) && (candidate.options === undefined ||
                ((candidate.options.overwrite === undefined || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === undefined || Is.boolean(candidate.options.ignoreIfExists)))) && (candidate.annotationId === undefined || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        CreateFile.is = is;
    })(CreateFile = exports.CreateFile || (exports.CreateFile = {}));
    var RenameFile;
    (function (RenameFile) {
        function create(oldUri, newUri, options, annotation) {
            var result = {
                kind: 'rename',
                oldUri: oldUri,
                newUri: newUri
            };
            if (options !== undefined && (options.overwrite !== undefined || options.ignoreIfExists !== undefined)) {
                result.options = options;
            }
            if (annotation !== undefined) {
                result.annotationId = annotation;
            }
            return result;
        }
        RenameFile.create = create;
        function is(value) {
            var candidate = value;
            return candidate && candidate.kind === 'rename' && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === undefined ||
                ((candidate.options.overwrite === undefined || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === undefined || Is.boolean(candidate.options.ignoreIfExists)))) && (candidate.annotationId === undefined || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        RenameFile.is = is;
    })(RenameFile = exports.RenameFile || (exports.RenameFile = {}));
    var DeleteFile;
    (function (DeleteFile) {
        function create(uri, options, annotation) {
            var result = {
                kind: 'delete',
                uri: uri
            };
            if (options !== undefined && (options.recursive !== undefined || options.ignoreIfNotExists !== undefined)) {
                result.options = options;
            }
            if (annotation !== undefined) {
                result.annotationId = annotation;
            }
            return result;
        }
        DeleteFile.create = create;
        function is(value) {
            var candidate = value;
            return candidate && candidate.kind === 'delete' && Is.string(candidate.uri) && (candidate.options === undefined ||
                ((candidate.options.recursive === undefined || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === undefined || Is.boolean(candidate.options.ignoreIfNotExists)))) && (candidate.annotationId === undefined || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        DeleteFile.is = is;
    })(DeleteFile = exports.DeleteFile || (exports.DeleteFile = {}));
    var WorkspaceEdit;
    (function (WorkspaceEdit) {
        function is(value) {
            var candidate = value;
            return candidate &&
                (candidate.changes !== undefined || candidate.documentChanges !== undefined) &&
                (candidate.documentChanges === undefined || candidate.documentChanges.every(function (change) {
                    if (Is.string(change.kind)) {
                        return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
                    }
                    else {
                        return TextDocumentEdit.is(change);
                    }
                }));
        }
        WorkspaceEdit.is = is;
    })(WorkspaceEdit = exports.WorkspaceEdit || (exports.WorkspaceEdit = {}));
    var TextEditChangeImpl = /** @class */ (function () {
        function TextEditChangeImpl(edits, changeAnnotations) {
            this.edits = edits;
            this.changeAnnotations = changeAnnotations;
        }
        TextEditChangeImpl.prototype.insert = function (position, newText, annotation) {
            var edit;
            var id;
            if (annotation === undefined) {
                edit = TextEdit.insert(position, newText);
            }
            else if (ChangeAnnotationIdentifier.is(annotation)) {
                id = annotation;
                edit = AnnotatedTextEdit.insert(position, newText, annotation);
            }
            else {
                this.assertChangeAnnotations(this.changeAnnotations);
                id = this.changeAnnotations.manage(annotation);
                edit = AnnotatedTextEdit.insert(position, newText, id);
            }
            this.edits.push(edit);
            if (id !== undefined) {
                return id;
            }
        };
        TextEditChangeImpl.prototype.replace = function (range, newText, annotation) {
            var edit;
            var id;
            if (annotation === undefined) {
                edit = TextEdit.replace(range, newText);
            }
            else if (ChangeAnnotationIdentifier.is(annotation)) {
                id = annotation;
                edit = AnnotatedTextEdit.replace(range, newText, annotation);
            }
            else {
                this.assertChangeAnnotations(this.changeAnnotations);
                id = this.changeAnnotations.manage(annotation);
                edit = AnnotatedTextEdit.replace(range, newText, id);
            }
            this.edits.push(edit);
            if (id !== undefined) {
                return id;
            }
        };
        TextEditChangeImpl.prototype.delete = function (range, annotation) {
            var edit;
            var id;
            if (annotation === undefined) {
                edit = TextEdit.del(range);
            }
            else if (ChangeAnnotationIdentifier.is(annotation)) {
                id = annotation;
                edit = AnnotatedTextEdit.del(range, annotation);
            }
            else {
                this.assertChangeAnnotations(this.changeAnnotations);
                id = this.changeAnnotations.manage(annotation);
                edit = AnnotatedTextEdit.del(range, id);
            }
            this.edits.push(edit);
            if (id !== undefined) {
                return id;
            }
        };
        TextEditChangeImpl.prototype.add = function (edit) {
            this.edits.push(edit);
        };
        TextEditChangeImpl.prototype.all = function () {
            return this.edits;
        };
        TextEditChangeImpl.prototype.clear = function () {
            this.edits.splice(0, this.edits.length);
        };
        TextEditChangeImpl.prototype.assertChangeAnnotations = function (value) {
            if (value === undefined) {
                throw new Error("Text edit change is not configured to manage change annotations.");
            }
        };
        return TextEditChangeImpl;
    }());
    /**
     * A helper class
     */
    var ChangeAnnotations = /** @class */ (function () {
        function ChangeAnnotations(annotations) {
            this._annotations = annotations === undefined ? Object.create(null) : annotations;
            this._counter = 0;
            this._size = 0;
        }
        ChangeAnnotations.prototype.all = function () {
            return this._annotations;
        };
        Object.defineProperty(ChangeAnnotations.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: false,
            configurable: true
        });
        ChangeAnnotations.prototype.manage = function (idOrAnnotation, annotation) {
            var id;
            if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
                id = idOrAnnotation;
            }
            else {
                id = this.nextId();
                annotation = idOrAnnotation;
            }
            if (this._annotations[id] !== undefined) {
                throw new Error("Id " + id + " is already in use.");
            }
            if (annotation === undefined) {
                throw new Error("No annotation provided for id " + id);
            }
            this._annotations[id] = annotation;
            this._size++;
            return id;
        };
        ChangeAnnotations.prototype.nextId = function () {
            this._counter++;
            return this._counter.toString();
        };
        return ChangeAnnotations;
    }());
    /**
     * A workspace change helps constructing changes to a workspace.
     */
    var WorkspaceChange = /** @class */ (function () {
        function WorkspaceChange(workspaceEdit) {
            var _this = this;
            this._textEditChanges = Object.create(null);
            if (workspaceEdit !== undefined) {
                this._workspaceEdit = workspaceEdit;
                if (workspaceEdit.documentChanges) {
                    this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
                    workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                    workspaceEdit.documentChanges.forEach(function (change) {
                        if (TextDocumentEdit.is(change)) {
                            var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
                            _this._textEditChanges[change.textDocument.uri] = textEditChange;
                        }
                    });
                }
                else if (workspaceEdit.changes) {
                    Object.keys(workspaceEdit.changes).forEach(function (key) {
                        var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                        _this._textEditChanges[key] = textEditChange;
                    });
                }
            }
            else {
                this._workspaceEdit = {};
            }
        }
        Object.defineProperty(WorkspaceChange.prototype, "edit", {
            /**
             * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
             * use to be returned from a workspace edit operation like rename.
             */
            get: function () {
                this.initDocumentChanges();
                if (this._changeAnnotations !== undefined) {
                    if (this._changeAnnotations.size === 0) {
                        this._workspaceEdit.changeAnnotations = undefined;
                    }
                    else {
                        this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                    }
                }
                return this._workspaceEdit;
            },
            enumerable: false,
            configurable: true
        });
        WorkspaceChange.prototype.getTextEditChange = function (key) {
            if (OptionalVersionedTextDocumentIdentifier.is(key)) {
                this.initDocumentChanges();
                if (this._workspaceEdit.documentChanges === undefined) {
                    throw new Error('Workspace edit is not configured for document changes.');
                }
                var textDocument = { uri: key.uri, version: key.version };
                var result = this._textEditChanges[textDocument.uri];
                if (!result) {
                    var edits = [];
                    var textDocumentEdit = {
                        textDocument: textDocument,
                        edits: edits
                    };
                    this._workspaceEdit.documentChanges.push(textDocumentEdit);
                    result = new TextEditChangeImpl(edits, this._changeAnnotations);
                    this._textEditChanges[textDocument.uri] = result;
                }
                return result;
            }
            else {
                this.initChanges();
                if (this._workspaceEdit.changes === undefined) {
                    throw new Error('Workspace edit is not configured for normal text edit changes.');
                }
                var result = this._textEditChanges[key];
                if (!result) {
                    var edits = [];
                    this._workspaceEdit.changes[key] = edits;
                    result = new TextEditChangeImpl(edits);
                    this._textEditChanges[key] = result;
                }
                return result;
            }
        };
        WorkspaceChange.prototype.initDocumentChanges = function () {
            if (this._workspaceEdit.documentChanges === undefined && this._workspaceEdit.changes === undefined) {
                this._changeAnnotations = new ChangeAnnotations();
                this._workspaceEdit.documentChanges = [];
                this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
            }
        };
        WorkspaceChange.prototype.initChanges = function () {
            if (this._workspaceEdit.documentChanges === undefined && this._workspaceEdit.changes === undefined) {
                this._workspaceEdit.changes = Object.create(null);
            }
        };
        WorkspaceChange.prototype.createFile = function (uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === undefined) {
                throw new Error('Workspace edit is not configured for document changes.');
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
                annotation = optionsOrAnnotation;
            }
            else {
                options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === undefined) {
                operation = CreateFile.create(uri, options);
            }
            else {
                id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
                operation = CreateFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== undefined) {
                return id;
            }
        };
        WorkspaceChange.prototype.renameFile = function (oldUri, newUri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === undefined) {
                throw new Error('Workspace edit is not configured for document changes.');
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
                annotation = optionsOrAnnotation;
            }
            else {
                options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === undefined) {
                operation = RenameFile.create(oldUri, newUri, options);
            }
            else {
                id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
                operation = RenameFile.create(oldUri, newUri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== undefined) {
                return id;
            }
        };
        WorkspaceChange.prototype.deleteFile = function (uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === undefined) {
                throw new Error('Workspace edit is not configured for document changes.');
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
                annotation = optionsOrAnnotation;
            }
            else {
                options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === undefined) {
                operation = DeleteFile.create(uri, options);
            }
            else {
                id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
                operation = DeleteFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== undefined) {
                return id;
            }
        };
        return WorkspaceChange;
    }());
    exports.WorkspaceChange = WorkspaceChange;
    /**
     * The TextDocumentIdentifier namespace provides helper functions to work with
     * [TextDocumentIdentifier](#TextDocumentIdentifier) literals.
     */
    var TextDocumentIdentifier;
    (function (TextDocumentIdentifier) {
        /**
         * Creates a new TextDocumentIdentifier literal.
         * @param uri The document's uri.
         */
        function create(uri) {
            return { uri: uri };
        }
        TextDocumentIdentifier.create = create;
        /**
         * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri);
        }
        TextDocumentIdentifier.is = is;
    })(TextDocumentIdentifier = exports.TextDocumentIdentifier || (exports.TextDocumentIdentifier = {}));
    /**
     * The VersionedTextDocumentIdentifier namespace provides helper functions to work with
     * [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) literals.
     */
    var VersionedTextDocumentIdentifier;
    (function (VersionedTextDocumentIdentifier) {
        /**
         * Creates a new VersionedTextDocumentIdentifier literal.
         * @param uri The document's uri.
         * @param uri The document's text.
         */
        function create(uri, version) {
            return { uri: uri, version: version };
        }
        VersionedTextDocumentIdentifier.create = create;
        /**
         * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
        }
        VersionedTextDocumentIdentifier.is = is;
    })(VersionedTextDocumentIdentifier = exports.VersionedTextDocumentIdentifier || (exports.VersionedTextDocumentIdentifier = {}));
    /**
     * The OptionalVersionedTextDocumentIdentifier namespace provides helper functions to work with
     * [OptionalVersionedTextDocumentIdentifier](#OptionalVersionedTextDocumentIdentifier) literals.
     */
    var OptionalVersionedTextDocumentIdentifier;
    (function (OptionalVersionedTextDocumentIdentifier) {
        /**
         * Creates a new OptionalVersionedTextDocumentIdentifier literal.
         * @param uri The document's uri.
         * @param uri The document's text.
         */
        function create(uri, version) {
            return { uri: uri, version: version };
        }
        OptionalVersionedTextDocumentIdentifier.create = create;
        /**
         * Checks whether the given literal conforms to the [OptionalVersionedTextDocumentIdentifier](#OptionalVersionedTextDocumentIdentifier) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
        }
        OptionalVersionedTextDocumentIdentifier.is = is;
    })(OptionalVersionedTextDocumentIdentifier = exports.OptionalVersionedTextDocumentIdentifier || (exports.OptionalVersionedTextDocumentIdentifier = {}));
    /**
     * The TextDocumentItem namespace provides helper functions to work with
     * [TextDocumentItem](#TextDocumentItem) literals.
     */
    var TextDocumentItem;
    (function (TextDocumentItem) {
        /**
         * Creates a new TextDocumentItem literal.
         * @param uri The document's uri.
         * @param languageId The document's language identifier.
         * @param version The document's version number.
         * @param text The document's text.
         */
        function create(uri, languageId, version, text) {
            return { uri: uri, languageId: languageId, version: version, text: text };
        }
        TextDocumentItem.create = create;
        /**
         * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
        }
        TextDocumentItem.is = is;
    })(TextDocumentItem = exports.TextDocumentItem || (exports.TextDocumentItem = {}));
    /**
     * Describes the content type that a client supports in various
     * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
     *
     * Please note that `MarkupKinds` must not start with a `$`. This kinds
     * are reserved for internal usage.
     */
    var MarkupKind;
    (function (MarkupKind) {
        /**
         * Plain text is supported as a content format
         */
        MarkupKind.PlainText = 'plaintext';
        /**
         * Markdown is supported as a content format
         */
        MarkupKind.Markdown = 'markdown';
    })(MarkupKind = exports.MarkupKind || (exports.MarkupKind = {}));
    (function (MarkupKind) {
        /**
         * Checks whether the given value is a value of the [MarkupKind](#MarkupKind) type.
         */
        function is(value) {
            var candidate = value;
            return candidate === MarkupKind.PlainText || candidate === MarkupKind.Markdown;
        }
        MarkupKind.is = is;
    })(MarkupKind = exports.MarkupKind || (exports.MarkupKind = {}));
    var MarkupContent;
    (function (MarkupContent) {
        /**
         * Checks whether the given value conforms to the [MarkupContent](#MarkupContent) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
        }
        MarkupContent.is = is;
    })(MarkupContent = exports.MarkupContent || (exports.MarkupContent = {}));
    /**
     * The kind of a completion entry.
     */
    var CompletionItemKind;
    (function (CompletionItemKind) {
        CompletionItemKind.Text = 1;
        CompletionItemKind.Method = 2;
        CompletionItemKind.Function = 3;
        CompletionItemKind.Constructor = 4;
        CompletionItemKind.Field = 5;
        CompletionItemKind.Variable = 6;
        CompletionItemKind.Class = 7;
        CompletionItemKind.Interface = 8;
        CompletionItemKind.Module = 9;
        CompletionItemKind.Property = 10;
        CompletionItemKind.Unit = 11;
        CompletionItemKind.Value = 12;
        CompletionItemKind.Enum = 13;
        CompletionItemKind.Keyword = 14;
        CompletionItemKind.Snippet = 15;
        CompletionItemKind.Color = 16;
        CompletionItemKind.File = 17;
        CompletionItemKind.Reference = 18;
        CompletionItemKind.Folder = 19;
        CompletionItemKind.EnumMember = 20;
        CompletionItemKind.Constant = 21;
        CompletionItemKind.Struct = 22;
        CompletionItemKind.Event = 23;
        CompletionItemKind.Operator = 24;
        CompletionItemKind.TypeParameter = 25;
    })(CompletionItemKind = exports.CompletionItemKind || (exports.CompletionItemKind = {}));
    /**
     * Defines whether the insert text in a completion item should be interpreted as
     * plain text or a snippet.
     */
    var InsertTextFormat;
    (function (InsertTextFormat) {
        /**
         * The primary text to be inserted is treated as a plain string.
         */
        InsertTextFormat.PlainText = 1;
        /**
         * The primary text to be inserted is treated as a snippet.
         *
         * A snippet can define tab stops and placeholders with `$1`, `$2`
         * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
         * the end of the snippet. Placeholders with equal identifiers are linked,
         * that is typing in one will update others too.
         *
         * See also: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#snippet_syntax
         */
        InsertTextFormat.Snippet = 2;
    })(InsertTextFormat = exports.InsertTextFormat || (exports.InsertTextFormat = {}));
    /**
     * Completion item tags are extra annotations that tweak the rendering of a completion
     * item.
     *
     * @since 3.15.0
     */
    var CompletionItemTag;
    (function (CompletionItemTag) {
        /**
         * Render a completion as obsolete, usually using a strike-out.
         */
        CompletionItemTag.Deprecated = 1;
    })(CompletionItemTag = exports.CompletionItemTag || (exports.CompletionItemTag = {}));
    /**
     * The InsertReplaceEdit namespace provides functions to deal with insert / replace edits.
     *
     * @since 3.16.0
     */
    var InsertReplaceEdit;
    (function (InsertReplaceEdit) {
        /**
         * Creates a new insert / replace edit
         */
        function create(newText, insert, replace) {
            return { newText: newText, insert: insert, replace: replace };
        }
        InsertReplaceEdit.create = create;
        /**
         * Checks whether the given literal conforms to the [InsertReplaceEdit](#InsertReplaceEdit) interface.
         */
        function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.newText) && Range.is(candidate.insert) && Range.is(candidate.replace);
        }
        InsertReplaceEdit.is = is;
    })(InsertReplaceEdit = exports.InsertReplaceEdit || (exports.InsertReplaceEdit = {}));
    /**
     * How whitespace and indentation is handled during completion
     * item insertion.
     *
     * @since 3.16.0
     */
    var InsertTextMode;
    (function (InsertTextMode) {
        /**
         * The insertion or replace strings is taken as it is. If the
         * value is multi line the lines below the cursor will be
         * inserted using the indentation defined in the string value.
         * The client will not apply any kind of adjustments to the
         * string.
         */
        InsertTextMode.asIs = 1;
        /**
         * The editor adjusts leading whitespace of new lines so that
         * they match the indentation up to the cursor of the line for
         * which the item is accepted.
         *
         * Consider a line like this: <2tabs><cursor><3tabs>foo. Accepting a
         * multi line completion item is indented using 2 tabs and all
         * following lines inserted will be indented using 2 tabs as well.
         */
        InsertTextMode.adjustIndentation = 2;
    })(InsertTextMode = exports.InsertTextMode || (exports.InsertTextMode = {}));
    var CompletionItemLabelDetails;
    (function (CompletionItemLabelDetails) {
        function is(value) {
            var candidate = value;
            return candidate && (Is.string(candidate.detail) || candidate.detail === undefined) &&
                (Is.string(candidate.description) || candidate.description === undefined);
        }
        CompletionItemLabelDetails.is = is;
    })(CompletionItemLabelDetails = exports.CompletionItemLabelDetails || (exports.CompletionItemLabelDetails = {}));
    /**
     * The CompletionItem namespace provides functions to deal with
     * completion items.
     */
    var CompletionItem;
    (function (CompletionItem) {
        /**
         * Create a completion item and seed it with a label.
         * @param label The completion item's label
         */
        function create(label) {
            return { label: label };
        }
        CompletionItem.create = create;
    })(CompletionItem = exports.CompletionItem || (exports.CompletionItem = {}));
    /**
     * The CompletionList namespace provides functions to deal with
     * completion lists.
     */
    var CompletionList;
    (function (CompletionList) {
        /**
         * Creates a new completion list.
         *
         * @param items The completion items.
         * @param isIncomplete The list is not complete.
         */
        function create(items, isIncomplete) {
            return { items: items ? items : [], isIncomplete: !!isIncomplete };
        }
        CompletionList.create = create;
    })(CompletionList = exports.CompletionList || (exports.CompletionList = {}));
    var MarkedString;
    (function (MarkedString) {
        /**
         * Creates a marked string from plain text.
         *
         * @param plainText The plain text.
         */
        function fromPlainText(plainText) {
            return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
        }
        MarkedString.fromPlainText = fromPlainText;
        /**
         * Checks whether the given value conforms to the [MarkedString](#MarkedString) type.
         */
        function is(value) {
            var candidate = value;
            return Is.string(candidate) || (Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value));
        }
        MarkedString.is = is;
    })(MarkedString = exports.MarkedString || (exports.MarkedString = {}));
    var Hover;
    (function (Hover) {
        /**
         * Checks whether the given value conforms to the [Hover](#Hover) interface.
         */
        function is(value) {
            var candidate = value;
            return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) ||
                MarkedString.is(candidate.contents) ||
                Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === undefined || Range.is(value.range));
        }
        Hover.is = is;
    })(Hover = exports.Hover || (exports.Hover = {}));
    /**
     * The ParameterInformation namespace provides helper functions to work with
     * [ParameterInformation](#ParameterInformation) literals.
     */
    var ParameterInformation;
    (function (ParameterInformation) {
        /**
         * Creates a new parameter information literal.
         *
         * @param label A label string.
         * @param documentation A doc string.
         */
        function create(label, documentation) {
            return documentation ? { label: label, documentation: documentation } : { label: label };
        }
        ParameterInformation.create = create;
    })(ParameterInformation = exports.ParameterInformation || (exports.ParameterInformation = {}));
    /**
     * The SignatureInformation namespace provides helper functions to work with
     * [SignatureInformation](#SignatureInformation) literals.
     */
    var SignatureInformation;
    (function (SignatureInformation) {
        function create(label, documentation) {
            var parameters = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                parameters[_i - 2] = arguments[_i];
            }
            var result = { label: label };
            if (Is.defined(documentation)) {
                result.documentation = documentation;
            }
            if (Is.defined(parameters)) {
                result.parameters = parameters;
            }
            else {
                result.parameters = [];
            }
            return result;
        }
        SignatureInformation.create = create;
    })(SignatureInformation = exports.SignatureInformation || (exports.SignatureInformation = {}));
    /**
     * A document highlight kind.
     */
    var DocumentHighlightKind;
    (function (DocumentHighlightKind) {
        /**
         * A textual occurrence.
         */
        DocumentHighlightKind.Text = 1;
        /**
         * Read-access of a symbol, like reading a variable.
         */
        DocumentHighlightKind.Read = 2;
        /**
         * Write-access of a symbol, like writing to a variable.
         */
        DocumentHighlightKind.Write = 3;
    })(DocumentHighlightKind = exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
    /**
     * DocumentHighlight namespace to provide helper functions to work with
     * [DocumentHighlight](#DocumentHighlight) literals.
     */
    var DocumentHighlight;
    (function (DocumentHighlight) {
        /**
         * Create a DocumentHighlight object.
         * @param range The range the highlight applies to.
         */
        function create(range, kind) {
            var result = { range: range };
            if (Is.number(kind)) {
                result.kind = kind;
            }
            return result;
        }
        DocumentHighlight.create = create;
    })(DocumentHighlight = exports.DocumentHighlight || (exports.DocumentHighlight = {}));
    /**
     * A symbol kind.
     */
    var SymbolKind;
    (function (SymbolKind) {
        SymbolKind.File = 1;
        SymbolKind.Module = 2;
        SymbolKind.Namespace = 3;
        SymbolKind.Package = 4;
        SymbolKind.Class = 5;
        SymbolKind.Method = 6;
        SymbolKind.Property = 7;
        SymbolKind.Field = 8;
        SymbolKind.Constructor = 9;
        SymbolKind.Enum = 10;
        SymbolKind.Interface = 11;
        SymbolKind.Function = 12;
        SymbolKind.Variable = 13;
        SymbolKind.Constant = 14;
        SymbolKind.String = 15;
        SymbolKind.Number = 16;
        SymbolKind.Boolean = 17;
        SymbolKind.Array = 18;
        SymbolKind.Object = 19;
        SymbolKind.Key = 20;
        SymbolKind.Null = 21;
        SymbolKind.EnumMember = 22;
        SymbolKind.Struct = 23;
        SymbolKind.Event = 24;
        SymbolKind.Operator = 25;
        SymbolKind.TypeParameter = 26;
    })(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
    /**
     * Symbol tags are extra annotations that tweak the rendering of a symbol.
     * @since 3.16
     */
    var SymbolTag;
    (function (SymbolTag) {
        /**
         * Render a symbol as obsolete, usually using a strike-out.
         */
        SymbolTag.Deprecated = 1;
    })(SymbolTag = exports.SymbolTag || (exports.SymbolTag = {}));
    var SymbolInformation;
    (function (SymbolInformation) {
        /**
         * Creates a new symbol information literal.
         *
         * @param name The name of the symbol.
         * @param kind The kind of the symbol.
         * @param range The range of the location of the symbol.
         * @param uri The resource of the location of symbol, defaults to the current document.
         * @param containerName The name of the symbol containing the symbol.
         */
        function create(name, kind, range, uri, containerName) {
            var result = {
                name: name,
                kind: kind,
                location: { uri: uri, range: range }
            };
            if (containerName) {
                result.containerName = containerName;
            }
            return result;
        }
        SymbolInformation.create = create;
    })(SymbolInformation = exports.SymbolInformation || (exports.SymbolInformation = {}));
    var DocumentSymbol;
    (function (DocumentSymbol) {
        /**
         * Creates a new symbol information literal.
         *
         * @param name The name of the symbol.
         * @param detail The detail of the symbol.
         * @param kind The kind of the symbol.
         * @param range The range of the symbol.
         * @param selectionRange The selectionRange of the symbol.
         * @param children Children of the symbol.
         */
        function create(name, detail, kind, range, selectionRange, children) {
            var result = {
                name: name,
                detail: detail,
                kind: kind,
                range: range,
                selectionRange: selectionRange
            };
            if (children !== undefined) {
                result.children = children;
            }
            return result;
        }
        DocumentSymbol.create = create;
        /**
         * Checks whether the given literal conforms to the [DocumentSymbol](#DocumentSymbol) interface.
         */
        function is(value) {
            var candidate = value;
            return candidate &&
                Is.string(candidate.name) && Is.number(candidate.kind) &&
                Range.is(candidate.range) && Range.is(candidate.selectionRange) &&
                (candidate.detail === undefined || Is.string(candidate.detail)) &&
                (candidate.deprecated === undefined || Is.boolean(candidate.deprecated)) &&
                (candidate.children === undefined || Array.isArray(candidate.children)) &&
                (candidate.tags === undefined || Array.isArray(candidate.tags));
        }
        DocumentSymbol.is = is;
    })(DocumentSymbol = exports.DocumentSymbol || (exports.DocumentSymbol = {}));
    /**
     * A set of predefined code action kinds
     */
    var CodeActionKind;
    (function (CodeActionKind) {
        /**
         * Empty kind.
         */
        CodeActionKind.Empty = '';
        /**
         * Base kind for quickfix actions: 'quickfix'
         */
        CodeActionKind.QuickFix = 'quickfix';
        /**
         * Base kind for refactoring actions: 'refactor'
         */
        CodeActionKind.Refactor = 'refactor';
        /**
         * Base kind for refactoring extraction actions: 'refactor.extract'
         *
         * Example extract actions:
         *
         * - Extract method
         * - Extract function
         * - Extract variable
         * - Extract interface from class
         * - ...
         */
        CodeActionKind.RefactorExtract = 'refactor.extract';
        /**
         * Base kind for refactoring inline actions: 'refactor.inline'
         *
         * Example inline actions:
         *
         * - Inline function
         * - Inline variable
         * - Inline constant
         * - ...
         */
        CodeActionKind.RefactorInline = 'refactor.inline';
        /**
         * Base kind for refactoring rewrite actions: 'refactor.rewrite'
         *
         * Example rewrite actions:
         *
         * - Convert JavaScript function to class
         * - Add or remove parameter
         * - Encapsulate field
         * - Make method static
         * - Move method to base class
         * - ...
         */
        CodeActionKind.RefactorRewrite = 'refactor.rewrite';
        /**
         * Base kind for source actions: `source`
         *
         * Source code actions apply to the entire file.
         */
        CodeActionKind.Source = 'source';
        /**
         * Base kind for an organize imports source action: `source.organizeImports`
         */
        CodeActionKind.SourceOrganizeImports = 'source.organizeImports';
        /**
         * Base kind for auto-fix source actions: `source.fixAll`.
         *
         * Fix all actions automatically fix errors that have a clear fix that do not require user input.
         * They should not suppress errors or perform unsafe fixes such as generating new types or classes.
         *
         * @since 3.15.0
         */
        CodeActionKind.SourceFixAll = 'source.fixAll';
    })(CodeActionKind = exports.CodeActionKind || (exports.CodeActionKind = {}));
    /**
     * The CodeActionContext namespace provides helper functions to work with
     * [CodeActionContext](#CodeActionContext) literals.
     */
    var CodeActionContext;
    (function (CodeActionContext) {
        /**
         * Creates a new CodeActionContext literal.
         */
        function create(diagnostics, only) {
            var result = { diagnostics: diagnostics };
            if (only !== undefined && only !== null) {
                result.only = only;
            }
            return result;
        }
        CodeActionContext.create = create;
        /**
         * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === undefined || Is.typedArray(candidate.only, Is.string));
        }
        CodeActionContext.is = is;
    })(CodeActionContext = exports.CodeActionContext || (exports.CodeActionContext = {}));
    var CodeAction;
    (function (CodeAction) {
        function create(title, kindOrCommandOrEdit, kind) {
            var result = { title: title };
            var checkKind = true;
            if (typeof kindOrCommandOrEdit === 'string') {
                checkKind = false;
                result.kind = kindOrCommandOrEdit;
            }
            else if (Command.is(kindOrCommandOrEdit)) {
                result.command = kindOrCommandOrEdit;
            }
            else {
                result.edit = kindOrCommandOrEdit;
            }
            if (checkKind && kind !== undefined) {
                result.kind = kind;
            }
            return result;
        }
        CodeAction.create = create;
        function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.title) &&
                (candidate.diagnostics === undefined || Is.typedArray(candidate.diagnostics, Diagnostic.is)) &&
                (candidate.kind === undefined || Is.string(candidate.kind)) &&
                (candidate.edit !== undefined || candidate.command !== undefined) &&
                (candidate.command === undefined || Command.is(candidate.command)) &&
                (candidate.isPreferred === undefined || Is.boolean(candidate.isPreferred)) &&
                (candidate.edit === undefined || WorkspaceEdit.is(candidate.edit));
        }
        CodeAction.is = is;
    })(CodeAction = exports.CodeAction || (exports.CodeAction = {}));
    /**
     * The CodeLens namespace provides helper functions to work with
     * [CodeLens](#CodeLens) literals.
     */
    var CodeLens;
    (function (CodeLens) {
        /**
         * Creates a new CodeLens literal.
         */
        function create(range, data) {
            var result = { range: range };
            if (Is.defined(data)) {
                result.data = data;
            }
            return result;
        }
        CodeLens.create = create;
        /**
         * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
        }
        CodeLens.is = is;
    })(CodeLens = exports.CodeLens || (exports.CodeLens = {}));
    /**
     * The FormattingOptions namespace provides helper functions to work with
     * [FormattingOptions](#FormattingOptions) literals.
     */
    var FormattingOptions;
    (function (FormattingOptions) {
        /**
         * Creates a new FormattingOptions literal.
         */
        function create(tabSize, insertSpaces) {
            return { tabSize: tabSize, insertSpaces: insertSpaces };
        }
        FormattingOptions.create = create;
        /**
         * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
        }
        FormattingOptions.is = is;
    })(FormattingOptions = exports.FormattingOptions || (exports.FormattingOptions = {}));
    /**
     * The DocumentLink namespace provides helper functions to work with
     * [DocumentLink](#DocumentLink) literals.
     */
    var DocumentLink;
    (function (DocumentLink) {
        /**
         * Creates a new DocumentLink literal.
         */
        function create(range, target, data) {
            return { range: range, target: target, data: data };
        }
        DocumentLink.create = create;
        /**
         * Checks whether the given literal conforms to the [DocumentLink](#DocumentLink) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
        }
        DocumentLink.is = is;
    })(DocumentLink = exports.DocumentLink || (exports.DocumentLink = {}));
    /**
     * The SelectionRange namespace provides helper function to work with
     * SelectionRange literals.
     */
    var SelectionRange;
    (function (SelectionRange) {
        /**
         * Creates a new SelectionRange
         * @param range the range.
         * @param parent an optional parent.
         */
        function create(range, parent) {
            return { range: range, parent: parent };
        }
        SelectionRange.create = create;
        function is(value) {
            var candidate = value;
            return candidate !== undefined && Range.is(candidate.range) && (candidate.parent === undefined || SelectionRange.is(candidate.parent));
        }
        SelectionRange.is = is;
    })(SelectionRange = exports.SelectionRange || (exports.SelectionRange = {}));
    /**
     * A set of predefined token types. This set is not fixed
     * an clients can specify additional token types via the
     * corresponding client capabilities.
     *
     * @since 3.16.0
     */
    var SemanticTokenTypes;
    (function (SemanticTokenTypes) {
        SemanticTokenTypes["namespace"] = "namespace";
        /**
         * Represents a generic type. Acts as a fallback for types which can't be mapped to
         * a specific type like class or enum.
         */
        SemanticTokenTypes["type"] = "type";
        SemanticTokenTypes["class"] = "class";
        SemanticTokenTypes["enum"] = "enum";
        SemanticTokenTypes["interface"] = "interface";
        SemanticTokenTypes["struct"] = "struct";
        SemanticTokenTypes["typeParameter"] = "typeParameter";
        SemanticTokenTypes["parameter"] = "parameter";
        SemanticTokenTypes["variable"] = "variable";
        SemanticTokenTypes["property"] = "property";
        SemanticTokenTypes["enumMember"] = "enumMember";
        SemanticTokenTypes["event"] = "event";
        SemanticTokenTypes["function"] = "function";
        SemanticTokenTypes["method"] = "method";
        SemanticTokenTypes["macro"] = "macro";
        SemanticTokenTypes["keyword"] = "keyword";
        SemanticTokenTypes["modifier"] = "modifier";
        SemanticTokenTypes["comment"] = "comment";
        SemanticTokenTypes["string"] = "string";
        SemanticTokenTypes["number"] = "number";
        SemanticTokenTypes["regexp"] = "regexp";
        SemanticTokenTypes["operator"] = "operator";
    })(SemanticTokenTypes = exports.SemanticTokenTypes || (exports.SemanticTokenTypes = {}));
    /**
     * A set of predefined token modifiers. This set is not fixed
     * an clients can specify additional token types via the
     * corresponding client capabilities.
     *
     * @since 3.16.0
     */
    var SemanticTokenModifiers;
    (function (SemanticTokenModifiers) {
        SemanticTokenModifiers["declaration"] = "declaration";
        SemanticTokenModifiers["definition"] = "definition";
        SemanticTokenModifiers["readonly"] = "readonly";
        SemanticTokenModifiers["static"] = "static";
        SemanticTokenModifiers["deprecated"] = "deprecated";
        SemanticTokenModifiers["abstract"] = "abstract";
        SemanticTokenModifiers["async"] = "async";
        SemanticTokenModifiers["modification"] = "modification";
        SemanticTokenModifiers["documentation"] = "documentation";
        SemanticTokenModifiers["defaultLibrary"] = "defaultLibrary";
    })(SemanticTokenModifiers = exports.SemanticTokenModifiers || (exports.SemanticTokenModifiers = {}));
    /**
     * @since 3.16.0
     */
    var SemanticTokens;
    (function (SemanticTokens) {
        function is(value) {
            var candidate = value;
            return candidate !== undefined && (candidate.resultId === undefined || typeof candidate.resultId === 'string') &&
                Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === 'number');
        }
        SemanticTokens.is = is;
    })(SemanticTokens = exports.SemanticTokens || (exports.SemanticTokens = {}));
    exports.EOL = ['\n', '\r\n', '\r'];
    /**
     * @deprecated Use the text document from the new vscode-languageserver-textdocument package.
     */
    var TextDocument;
    (function (TextDocument) {
        /**
         * Creates a new ITextDocument literal from the given uri and content.
         * @param uri The document's uri.
         * @param languageId  The document's language Id.
         * @param content The document's content.
         */
        function create(uri, languageId, version, content) {
            return new FullTextDocument(uri, languageId, version, content);
        }
        TextDocument.create = create;
        /**
         * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount)
                && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
        }
        TextDocument.is = is;
        function applyEdits(document, edits) {
            var text = document.getText();
            var sortedEdits = mergeSort(edits, function (a, b) {
                var diff = a.range.start.line - b.range.start.line;
                if (diff === 0) {
                    return a.range.start.character - b.range.start.character;
                }
                return diff;
            });
            var lastModifiedOffset = text.length;
            for (var i = sortedEdits.length - 1; i >= 0; i--) {
                var e = sortedEdits[i];
                var startOffset = document.offsetAt(e.range.start);
                var endOffset = document.offsetAt(e.range.end);
                if (endOffset <= lastModifiedOffset) {
                    text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
                }
                else {
                    throw new Error('Overlapping edit');
                }
                lastModifiedOffset = startOffset;
            }
            return text;
        }
        TextDocument.applyEdits = applyEdits;
        function mergeSort(data, compare) {
            if (data.length <= 1) {
                // sorted
                return data;
            }
            var p = (data.length / 2) | 0;
            var left = data.slice(0, p);
            var right = data.slice(p);
            mergeSort(left, compare);
            mergeSort(right, compare);
            var leftIdx = 0;
            var rightIdx = 0;
            var i = 0;
            while (leftIdx < left.length && rightIdx < right.length) {
                var ret = compare(left[leftIdx], right[rightIdx]);
                if (ret <= 0) {
                    // smaller_equal -> take left to preserve order
                    data[i++] = left[leftIdx++];
                }
                else {
                    // greater -> take right
                    data[i++] = right[rightIdx++];
                }
            }
            while (leftIdx < left.length) {
                data[i++] = left[leftIdx++];
            }
            while (rightIdx < right.length) {
                data[i++] = right[rightIdx++];
            }
            return data;
        }
    })(TextDocument = exports.TextDocument || (exports.TextDocument = {}));
    /**
     * @deprecated Use the text document from the new vscode-languageserver-textdocument package.
     */
    var FullTextDocument = /** @class */ (function () {
        function FullTextDocument(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = undefined;
        }
        Object.defineProperty(FullTextDocument.prototype, "uri", {
            get: function () {
                return this._uri;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "languageId", {
            get: function () {
                return this._languageId;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: false,
            configurable: true
        });
        FullTextDocument.prototype.getText = function (range) {
            if (range) {
                var start = this.offsetAt(range.start);
                var end = this.offsetAt(range.end);
                return this._content.substring(start, end);
            }
            return this._content;
        };
        FullTextDocument.prototype.update = function (event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = undefined;
        };
        FullTextDocument.prototype.getLineOffsets = function () {
            if (this._lineOffsets === undefined) {
                var lineOffsets = [];
                var text = this._content;
                var isLineStart = true;
                for (var i = 0; i < text.length; i++) {
                    if (isLineStart) {
                        lineOffsets.push(i);
                        isLineStart = false;
                    }
                    var ch = text.charAt(i);
                    isLineStart = (ch === '\r' || ch === '\n');
                    if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
                        i++;
                    }
                }
                if (isLineStart && text.length > 0) {
                    lineOffsets.push(text.length);
                }
                this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
        };
        FullTextDocument.prototype.positionAt = function (offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
                return Position.create(0, offset);
            }
            while (low < high) {
                var mid = Math.floor((low + high) / 2);
                if (lineOffsets[mid] > offset) {
                    high = mid;
                }
                else {
                    low = mid + 1;
                }
            }
            // low is the least x for which the line offset is larger than the current offset
            // or array.length if no line offset is larger than the current offset
            var line = low - 1;
            return Position.create(line, offset - lineOffsets[line]);
        };
        FullTextDocument.prototype.offsetAt = function (position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
                return this._content.length;
            }
            else if (position.line < 0) {
                return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = (position.line + 1 < lineOffsets.length) ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
        };
        Object.defineProperty(FullTextDocument.prototype, "lineCount", {
            get: function () {
                return this.getLineOffsets().length;
            },
            enumerable: false,
            configurable: true
        });
        return FullTextDocument;
    }());
    var Is;
    (function (Is) {
        var toString = Object.prototype.toString;
        function defined(value) {
            return typeof value !== 'undefined';
        }
        Is.defined = defined;
        function undefined(value) {
            return typeof value === 'undefined';
        }
        Is.undefined = undefined;
        function boolean(value) {
            return value === true || value === false;
        }
        Is.boolean = boolean;
        function string(value) {
            return toString.call(value) === '[object String]';
        }
        Is.string = string;
        function number(value) {
            return toString.call(value) === '[object Number]';
        }
        Is.number = number;
        function numberRange(value, min, max) {
            return toString.call(value) === '[object Number]' && min <= value && value <= max;
        }
        Is.numberRange = numberRange;
        function integer(value) {
            return toString.call(value) === '[object Number]' && -2147483648 <= value && value <= 2147483647;
        }
        Is.integer = integer;
        function uinteger(value) {
            return toString.call(value) === '[object Number]' && 0 <= value && value <= 2147483647;
        }
        Is.uinteger = uinteger;
        function func(value) {
            return toString.call(value) === '[object Function]';
        }
        Is.func = func;
        function objectLiteral(value) {
            // Strictly speaking class instances pass this check as well. Since the LSP
            // doesn't use classes we ignore this for now. If we do we need to add something
            // like this: `Object.getPrototypeOf(Object.getPrototypeOf(x)) === null`
            return value !== null && typeof value === 'object';
        }
        Is.objectLiteral = objectLiteral;
        function typedArray(value, check) {
            return Array.isArray(value) && value.every(check);
        }
        Is.typedArray = typedArray;
    })(Is || (Is = {}));
});
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 3348:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const glob = __importStar(__nccwpck_require__(8090));
const scanner_1 = __importDefault(__nccwpck_require__(3157));
const main = async () => {
    try {
        const globber = await glob.create(`${process.env.GITHUB_WORKSPACE}/evaluations/**/**/evaluation_*.json`);
        const [scanResult] = await globber.glob();
        if (!scanResult) {
            core.info(`No scan results found!`);
        }
        else {
            core.info(`Running scanning process...`);
            (0, scanner_1.default)(scanResult, core.getInput("dockerfile_name"), core.getInput("projectroot"), core.getInput("outputlocation"));
        }
    }
    catch (e) {
        core.setFailed(`Failed to run conversion! \n\n${e.message}`);
    }
};
main();


/***/ }),

/***/ 3248:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.searchLayerInstructions = exports.gatherLayerData = void 0;
const dockerfile_ast_1 = __nccwpck_require__(989);
const fs_1 = __nccwpck_require__(5747);
const glob_1 = __importDefault(__nccwpck_require__(1957));
const core = __importStar(__nccwpck_require__(2186));
function parseDockerfileInstructions(_location, handle) {
    return dockerfile_ast_1.DockerfileParser.parse(handle.toString()).getInstructions();
}
function gatherLayerData(dockerfileName = 'Dockerfile', projectRoot = ".") {
    core.info(`Gathering Layer data from Dockerfile(s)`);
    const retdata = [];
    const results = glob_1.default.sync(`**/${dockerfileName}`, { cwd: projectRoot });
    core.info(`Dockerfiles located: ${JSON.stringify(results)}`);
    for (var i = 0; i < results.length; i++) {
        const fileLocation = `${projectRoot.replace(/\/$/, '')}/${results[i]}`;
        const handle = (0, fs_1.readFileSync)(fileLocation);
        const data = parseDockerfileInstructions(results[i], handle);
        if (data) {
            retdata.push({ location: fileLocation, details: data });
        }
    }
    return retdata;
}
exports.gatherLayerData = gatherLayerData;
function searchLayerInstructions(cmd, data) {
    if (data) {
        const command = cmd.substring(0, cmd.indexOf('#')).trim();
        for (var i = 0; i < data.details.length; i++) {
            const d = data.details[i];
            if (d.getTextContent().includes(command)) {
                const details = d.getInstructionRange();
                // Note:When GH consumes this they count the offsets from 1, not 0 like this parser
                return {
                    uri: data.location,
                    startLine: details.start.line + 1,
                    startColumn: details.start.character + 1,
                    endColumn: details.end.character + 1,
                    endLine: details.end.line + 1,
                };
            }
        }
    }
}
exports.searchLayerInstructions = searchLayerInstructions;


/***/ }),

/***/ 3157:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __importStar(__nccwpck_require__(5747));
const parse_1 = __nccwpck_require__(3248);
const core = __importStar(__nccwpck_require__(2186));
const buildRuleDescriptionMarkdown = (image, layer, imgpackage, v) => {
    var _a;
    return `
${v.name} found in package ${imgpackage.name}

**Severity**: ${v.severity}
**CVSSv3 Score**: ${(_a = v.metadata) === null || _a === void 0 ? void 0 : _a.NVD.CVSSv3.Score}
**Image**: ${image.repository}:${image.tags[0]}
**Image layer hash**: ${layer.hash}
**Image creation command**: ${layer.created_by}
**Package Name**: ${imgpackage.name}@${imgpackage.version}

#### Description
${v.description}

More details [here](${v.link}).
`;
};
exports.default = (scanResult, customDockerfileName, projectRoot, outputLocation) => {
    // Test if input file var is set
    const msg = 'No scan result specified!  Must set scan result location!';
    if (!scanResult && !process.env.SCAN_RESULT) {
        throw new Error(msg);
    }
    const scanPath = scanResult || process.env.SCAN_RESULT;
    if (!scanPath) {
        throw new Error(msg);
    }
    core.info(`Looking for report output in ${scanPath}`);
    const result = JSON.parse(fs.readFileSync(scanPath).toString());
    const rules = [];
    const results = [];
    const layerData = (0, parse_1.gatherLayerData)(customDockerfileName || process.env.CUSTOM_DOCKERFILE_NAME, projectRoot || process.env.PROJECT_ROOT);
    result.image.image_layers.forEach(l => {
        l.packages.forEach(p => {
            p.vulnerabilities.forEach(v => {
                var _a, _b, _c, _d;
                const locationDetails = (0, parse_1.searchLayerInstructions)(l.created_by, layerData[0]);
                rules.push({
                    id: v.name,
                    helpUri: v.link,
                    help: {
                        text: v.description,
                        markdown: buildRuleDescriptionMarkdown(result.image.image_info, l, p, v),
                    },
                    properties: {
                        "security-severity": `${(_c = (_b = (_a = v.metadata) === null || _a === void 0 ? void 0 : _a.NVD) === null || _b === void 0 ? void 0 : _b.CVSSv3) === null || _c === void 0 ? void 0 : _c.Score}`,
                        ...(_d = v.metadata) === null || _d === void 0 ? void 0 : _d.NVD,
                    },
                });
                results.push({
                    ruleId: v.name,
                    message: {
                        text: `${v.name}`,
                    },
                    fingerprints: {
                        layer_hash: l.hash,
                    },
                    locations: [
                        {
                            physicalLocation: {
                                artifactLocation: {
                                    uri: layerData[0] ? layerData[0].location.replace('\./', '') : 'Dockerfile'
                                },
                                region: {
                                    startLine: locationDetails ? locationDetails.startLine : 1,
                                    endLine: locationDetails ? locationDetails.endLine : 1,
                                    startColumn: locationDetails ? locationDetails.startColumn : 1,
                                    endColumn: locationDetails ? locationDetails.endColumn : 2
                                }
                            }
                        }
                    ]
                });
            });
        });
    });
    // Build SARIF report object to be written
    let report = {
        tool: {
            driver: {
                version: "1.0",
                organization: "Lacework",
                name: "lacework-vuln-scanner",
                informationUri: "https://support.lacework.com/hc/en-us/articles/360035472393-Container-Vulnerability-Assessment-Overview",
                rules,
            },
        },
        results,
    };
    // Write results
    const output = {
        $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        version: "2.1.0",
        runs: [
            report,
        ],
    };
    const reportLocation = outputLocation || process.env.SARIF_REPORT || './report.sarif.json';
    core.info(`Writing out report to ${reportLocation} (cwd: ${process.cwd()})`);
    fs.writeFileSync(reportLocation, JSON.stringify(output, undefined, 2));
};


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(3348);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map