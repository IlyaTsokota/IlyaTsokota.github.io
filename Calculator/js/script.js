'use strict';
class Calculator {
	constructor({
		containerSelector,
		operationsSelector,
		clearSelector,
		deleteSelector,
		equalSelector,
		additionalOperationsSelector,
		inputSelector,
		answerSelector,
		scrollFieldSelector,
		historyContainer,
		plusMinusSelector
	}) {
		this.container = document.querySelector(containerSelector);
		this.operations = this.getOperations(operationsSelector);
		this.clearBtn = this.container.querySelector(clearSelector);
		this.deleteBtn = this.container.querySelector(deleteSelector);
		this.equalBtn = this.container.querySelector(equalSelector);
		this.additionalOperations = this.container.querySelectorAll(additionalOperationsSelector);
		this.input = this.container.querySelector(inputSelector);
		this.defaultValue = true;
		this.answer = this.container.querySelector(answerSelector);
		this.historyContainer = this.container.querySelector(historyContainer);
		this.scrollField = this.container.querySelector(scrollFieldSelector);
		this.standardOperationPattern = /[-%*+\/]/;
		this.bindEventOperations();
		this.scrollToBottomScrollField();
		this.input.addEventListener('keydown', () => this.autosizeInput());
		this.input.value = '0';
		this.answer.textContent = '0';
		this.clearBtn.addEventListener('click', () => this.clearInput());
		this.deleteBtn.addEventListener('click', () => this.deleteOneChar());
		this.historyLines = localStorage.getItem('history') === null ? [] : JSON.parse(localStorage.getItem('history'));
		this.loadHistory();
		this.equalBtn.addEventListener('click', () => this.addHistory(`${this.input.value}=${this.answer.textContent}`));
		this.bindEventAdditionalOperations();
		this.memoryValue = 0;
		this.plusMinusBtn = this.container.querySelector(plusMinusSelector);
		this.plusMinusBtn.addEventListener('click', () => this.plusMinusChange(this.input.value));
	}

	plusMinusChange(str) {
		let val = '',
			length = 0;
		for (let i = str.length - 1; i >= 0; i--) {
			if (!this.isStandardOperation(str[i])) {
				length++;
			} else {
				val = str[i];
				break;
			}
		}
		console.log(str.substring(str.length - length - 1, str.length));
		const secondChapter = val === '*' || val === '/' || val === '%' ? +str.substring(str.length - length, str.length) * -1 : +str.substring(str.length - length - 1, str.length) * -1;
		if (val === '*' || val === '/' || val === '%') {
			if (secondChapter < 0) {
				this.input.value = str.substring(0, str.length - length) + secondChapter;
			} else {
				this.input.value = str.substring(0, str.length - length )+ '+' +  secondChapter 
			}
		} else {
			if (secondChapter < 0) {
				this.input.value = str.substring(0, str.length - length - 1) + secondChapter;
			} else {
				this.input.value = str.substring(0, str.length - length - 1) + '+' + secondChapter;
			}
		}


		this.autosizeInput();
		this.scrollToBottomScrollField();
		this.parseStringCalculation(this.input.value);
	}

	parseStringCalculation(str) {
		let calc = new MathCalc(),
			expr = calc.parse(str),
			res = 0;
		expr.scope.fac = function (n) {
			let result = n;
			if (n < 0) {
				return null;
			}
			if (n === 1 || n === 0) {
				return 1;
			} else {
				while (n >= 2) {
					result = result * (n - 1);
					n--;
				}
				return result;
			}
		};
		if (!expr.error) {
			res = expr.eval();
			if (!isNaN(parseFloat(res))) {
				this.answer.textContent = res;
			}
		}

	}

	operationFromOperand(operand) {
		let val = this.returnValueFromOperand(operand);
		if (operand.search(/\^/) !== -1) {
			const nums = operand.split('^');
			if (nums.length > 2 || nums[1] === '') {
				return NaN;
			}
			val = Math.pow(this.operationFromOperand(nums[0]), this.operationFromOperand(nums[1]));
		}
		if (operand.search(/!/) !== -1) {
			val = this.factorial(parseInt(operand));
		}
		if (operand.search(/sqrt/) !== -1) {
			val = Math.sqrt(val);
		}
		return val || +operand;
	}



	returnValueFromOperand(operand) {
		const startIndex = operand.indexOf('(') + 1,
			endIndex = operand.indexOf(')');
		if (startIndex === -1 && endIndex === -1) {
			return operand;
		}
		return operand.substring(startIndex, endIndex);
	}

	performingStandardOperations(res, operand, operation) {
		let result = res;
		switch (operation) {
			case '+':
				result += operand;
				break;
			case '*':
				result *= operand;
				break;
			case '-':
				result -= operand;
				break;
			case '/':
				result /= operand;
				break;
			case '%':
				result /= operand;
				break;
		}
		return result;
	}


	scrollToBottomScrollField() {
		this.scrollField.scrollTop = this.scrollField.scrollHeight;
	}

	getOperations(operationsSelector) {
		const arr = this.container.querySelectorAll(operationsSelector);
		let operationNodes = [];
		arr.forEach(item => {
			if (item.getAttribute('id') === null) {
				operationNodes.push(item);
			}
		});
		return operationNodes;
	}
	bindEventAdditionalOperations() {
		this.additionalOperations.forEach(item => {
			item.addEventListener('click', () => {
				let operation = item.dataset.operation;
				if (operation === undefined) {
					if (this.defaultValue) {
						this.input.value = '';
						this.defaultValue = false;
					}
					this.input.value = this.input.value + item.textContent.trim();
				} else {
					this.memoryAction(operation);
				}
				this.autosizeInput();
				this.scrollToBottomScrollField();
				this.parseStringCalculation(this.input.value);

			});
		});
	}

	memoryAction(operation) {
		switch (operation) {
			case 'mr':
				this.memoryRecieve();
				break;
			case 'mc':
				this.memoryClear();
				break;
			case 'm+':
				this.memoryAddPlus();
				break;
			case 'm-':
				this.memoryAddMinus();
				break;
		}
	}

	memoryRecieve() {
		const operands = this.input.value.trim().split(this.standardOperationPattern).filter(item => item !== '');
		this.memoryValue = operands[operands.length - 1];
	}
	memoryClear() {
		this.memoryValue = 0;
	}
	memoryAddPlus() {
		if (this.memoryValue !== 0) {
			const val = this.input.value;

			if (this.isStandardOperation(val[val.length - 1])) {
				this.input.value = `${val}(+${this.memoryValue})`;
			} else {
				this.input.value = `${val}+${this.memoryValue}`;
			}
		}
	}
	memoryAddMinus() {
		if (this.memoryValue !== 0) {
			const val = this.input.value.trim();

			if (this.isStandardOperation(val[val.length - 1])) {
				this.input.value = `${val}(-${this.memoryValue})`;
			} else {
				this.input.value = `${val}-${this.memoryValue}`;
			}
		}
	}
	bindEventOperations() {
		this.operations.forEach(item => {
			item.addEventListener('click', () => {
				if (this.defaultValue) {
					this.input.value = '';
					this.defaultValue = false;
				}
				let currValue = this.input.value.trim(),
					length = currValue.length - 1,
					addValue = '';

				if (item.textContent.trim() === '') {
					addValue = item.dataset.operation;
				} else {
					addValue = item.textContent.trim();
				}

				if (length === -1) {
					if (addValue.search(/[+-]/) !== -1) {
						this.input.value = this.input.value + addValue;
					}
				}
				if (length >= 0 && this.isStandardOperation(addValue) && this.isStandardOperation(currValue[length])) {
					this.deleteOneChar();
					this.input.value = this.input.value + addValue;
				} else {
					this.input.value = currValue + addValue;
				}
				this.autosizeInput();
				this.scrollToBottomScrollField();
				this.parseStringCalculation(this.input.value);
			});
		});
	}

	isStandardOperation(str) {
		return str.search(this.standardOperationPattern) !== -1;
	}

	isNumber(str) {
		return str.search(/[0-9]/) !== -1;
	}

	clearInput() {
		this.input.value = '';
		this.autosizeInput();
		this.scrollToBottomScrollField();
		this.checkValue();
		this.parseStringCalculation(this.input.value);
	}

	deleteOneChar() {
		let val = this.input.value.trim();
		val = val.substring(0, val.length - 1);
		this.input.value = val;
		this.autosizeInput();
		this.scrollToBottomScrollField();
		this.checkValue();
		this.parseStringCalculation(this.input.value);

	}

	autosizeInput() {
		this.input.style.cssText = 'height:auto; padding:0';
		this.input.style.cssText = `min-height: ${this.input.scrollHeight}px`;
	}

	checkValue() {
		const val = this.input.value.trim();
		if (val.length === 0) {
			this.input.value = '0';
			this.defaultValue = true;
		}
	}

	loadHistory() {
		this.historyLines.forEach(item => {
			this.addHistoryItem(item);
		});
	}

	addHistoryItem(item) {
		const el = document.createElement('div');
		el.classList.add('history__line');
		el.textContent = item;
		this.historyContainer.append(el);
	}

	addHistory(str) {
		this.historyLines.push(str);
		localStorage.setItem('history', JSON.stringify(this.historyLines));
		this.addHistoryItem(str);
		this.answer.textContent = '0';
		this.input.value = '0';
		this.defaultValue = true;
	}

}



document.addEventListener('DOMContentLoaded', () => {
	const container = document.querySelector(".calculator__field"),
		btnHiddenMenuOpen = document.querySelector('.cacluculator__hidden-menu'),
		btnHiddenMenuClose = document.querySelector('.hidden-menu__close'),
		hiddenMenu = document.querySelector('.hidden-menu'),
		switchThemeBtn = document.querySelector('.calculator__top-theme'),
		navMenuTabs = document.querySelectorAll('.calculator__list-btn'),
		navMenuBodies = document.querySelectorAll('.calculator__body'),
		converterMenuTabs = document.querySelectorAll('.converter__item'),
		converterMenuBodies = document.querySelectorAll('.converter__body');
	converterMenuTabs.forEach((item, i) => {
		item.addEventListener('click', () => {
			converterMenuBodies.forEach(el => {
				el.classList.remove('converter__body--active');
			});
			converterMenuBodies[i].classList.add('converter__body--active');
		});
	});

	new Calculator({
		containerSelector: '.calculator__body',
		operationsSelector: '.calculator__operation',
		clearSelector: '#clear',
		deleteSelector: '#delete',
		equalSelector: '#equal',
		additionalOperationsSelector: '.hidden-menu__item',
		inputSelector: '.calculator__current-calculation',
		answerSelector: '.calculator__answer',
		scrollFieldSelector: '.calculator__field',
		historyContainer: '.history',
		plusMinusSelector: '#plus-minus'
	});

	btnHiddenMenuOpen.addEventListener('click', (e) => {
		e.preventDefault();
		hiddenMenu.classList.add('hidden-menu--active');
	});
	btnHiddenMenuClose.addEventListener('click', (e) => {
		e.preventDefault();
		hiddenMenu.classList.remove('hidden-menu--active');
	});
	switchThemeBtn.addEventListener('click', () => switchTheme(document.body, 'dark-theme'));

	scrollToBottom(container);
	defaultTab(0);

	navMenuTabs.forEach((item, i) => {
		item.addEventListener('click', (e) => {
			e.preventDefault();
			defaultTab(i);
		});
	});

	function defaultTab(i) {
		navMenuTabs.forEach(el => {
			el.parentElement.classList.remove('calculator__list-item--active');
		});
		navMenuTabs[i].parentElement.classList.add('calculator__list-item--active');
		navMenuBodies.forEach(item => {
			item.style.display = "none";
		});
		navMenuBodies[i].style.display = "block";
	}


	// converter

	const lengthConverterItems = document.querySelectorAll('#length .converter__body-input');
	lengthConverterItems[0].addEventListener('input', (e) => {
		const val = e.target.value;
		lengthConverterItems[2].value = val / 100;
		lengthConverterItems[1].value = val / 100000;
	});
	lengthConverterItems[1].addEventListener('input', (e) => {
		const val = e.target.value;
		lengthConverterItems[0].value = val * 100000;
		lengthConverterItems[2].value = val * 1000;
	});

	lengthConverterItems[2].addEventListener('input', (e) => {
		const val = e.target.value;
		lengthConverterItems[0].value = val * 100;
		lengthConverterItems[1].value = val / 1000;
	});

	const weightConverterItems = document.querySelectorAll('#weight .converter__body-input');
	weightConverterItems[0].addEventListener('input', (e) => {
		const val = e.target.value;
		weightConverterItems[1].value = val / 1000;
		weightConverterItems[2].value = val / 1000000;
	});
	weightConverterItems[1].addEventListener('input', (e) => {
		const val = e.target.value;
		weightConverterItems[0].value = val * 1000;
		weightConverterItems[2].value = val / 1000;
	});

	weightConverterItems[2].addEventListener('input', (e) => {
		const val = e.target.value;
		weightConverterItems[0].value = val * 1000000;
		weightConverterItems[1].value = val * 1000;
	});
	const areaConverterItems = document.querySelectorAll('#area .converter__body-input');
	areaConverterItems[0].addEventListener('input', (e) => {
		const val = e.target.value;
		areaConverterItems[2].value = val / 10000;
		areaConverterItems[1].value = val / 10000000000;
	});
	areaConverterItems[1].addEventListener('input', (e) => {
		const val = e.target.value;
		areaConverterItems[0].value = val * 10000000000;
		areaConverterItems[2].value = val * 1000000;
	});

	areaConverterItems[2].addEventListener('input', (e) => {
		const val = e.target.value;
		areaConverterItems[0].value = val * 10000;
		areaConverterItems[1].value = val / 1000000;
	});


});




function scrollToBottom(container) {
	container.scrollTop = container.scrollHeight;
}

function switchTheme(item, classActive) {
	item.classList.toggle(classActive);
	const img = item.querySelector('img');
	if (item.classList.contains(classActive)) {
		img.src = "./icons/moon.png";
	} else {
		img.src = "./icons/sun.png";
	}
}