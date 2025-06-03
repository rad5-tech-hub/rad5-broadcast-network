"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSentenceCase = void 0;
const toSentenceCase = (text) => {
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.length > 0 ? word[0].toUpperCase() + word.slice(1) : "")
        .join(" ");
};
exports.toSentenceCase = toSentenceCase;
