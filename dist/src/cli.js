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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const flipper_1 = __importDefault(require("./flipper"));
const options_type_1 = require("./@types/options.type");
const program = new commander_1.Command();
program
    .name('flipper')
    .description('CLI for feature management')
    .version('1.0.0');
program
    .command('list')
    .description('List all features and their statuses')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield flipper_1.default.init();
        console.log(chalk_1.default.blueBright('Feature statuses:'));
        const list = yield flipper_1.default.list();
        for (const [feature, status] of Object.entries(list)) {
            console.log(`Feature: ${chalk_1.default.blueBright(feature)}, Status: ${status ? chalk_1.default.green('enabled') : chalk_1.default.red('disabled')}`);
        }
        process.exit(0);
    }
    catch (e) {
        console.error(chalk_1.default.red(e.message));
        process.exit(1);
    }
}));
program
    .command('enable <feature>')
    .description('Enable a feature')
    .action((feature) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        options_type_1.featureSchema.parse(feature);
        yield flipper_1.default.init();
        yield flipper_1.default.enable(feature);
        console.log(chalk_1.default.green(`${feature} enabled`));
        process.exit(0);
    }
    catch (e) {
        console.error(chalk_1.default.red(e.message));
        process.exit(1);
    }
}));
program
    .command('disable <feature>')
    .description('Disable a feature')
    .action((feature) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        options_type_1.featureSchema.parse(feature);
        yield flipper_1.default.init();
        yield flipper_1.default.disable(feature);
        console.log(chalk_1.default.red(`${feature} disabled`));
        process.exit(0);
    }
    catch (e) {
        console.error(chalk_1.default.red(e.message));
        process.exit(1);
    }
}));
program
    .command('add <feature>')
    .description('Add a new feature (enabled by default)')
    .action((feature) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        options_type_1.featureSchema.parse(feature);
        yield flipper_1.default.init();
        yield flipper_1.default.enable(feature);
        console.log(chalk_1.default.green(`${feature} added and enabled by default`));
        process.exit(0);
    }
    catch (e) {
        console.error(chalk_1.default.red(e.message));
        process.exit(1);
    }
}));
program.parse(process.argv);
