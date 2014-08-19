goog.provide('codeshelf.ASCIIAlphaNumericComparer');

/**
 * ASCII Strings only for the time being
 */
codeshelf.ASCIIAlphaNumericComparer = function (a, b) {
		function chunkify(inString) {
			var stringParts = [], i = 0, partIndex = -1, lastDigitCharCode, charCode = null, ch = null;
			while (charCode = (ch = inString.charAt(i++)).charCodeAt(0)) {
				var isDigitCharCode = (charCode >=48 && charCode <= 57);
				if (isDigitCharCode !== lastDigitCharCode) {
					stringParts[++partIndex] = "";
					lastDigitCharCode = isDigitCharCode;
				}
				stringParts[partIndex] += ch;
			}
			return stringParts;
		}



		var aParts = chunkify(a);
		var bParts = chunkify(b);

		for (var i = 0; aParts[i] && bParts[i]; i++) {
			if (aParts[i] !== bParts[i]) {
				var aDigit = Number(aParts[i]), bDigit = Number(bParts[i]);
				if (aDigit == aParts[i] && bDigit == bParts[i]) {
					return aDigit - bDigit;
				} else {
					return (aParts[i] > bParts[i]) ? 1 : -1;
				}

			}
		}
		return aParts.length - bParts.length;
	};
