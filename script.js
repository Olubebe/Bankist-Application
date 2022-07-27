//Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
    /*
    Difference between textContent and innerHTML is that textContent returns the text itself innerHTML returns everythinf including the HTML
    */
    containerMovements.innerHTML = '';

    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements
    movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal'
        const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
<div class="movements__value">${mov}€</div>
</div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    })
};
displayMovements(account1.movements);

const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance}€`
}

const calcDisplaySummary = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}€`

    const out = movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0)
    labelSumOut.textContent = `${Math.abs(out)}€`

    const interest = movements.filter(mov => mov > 0)
        .map(deposit => deposit * acc.interestRate / 100)
        .filter((int, i, arr) => {
            console.log(arr);
            return int >= 1
        })
        .reduce((acc, int) => acc + int, 0)
    labelSumInterest.textContent = `${interest}€`
}

const createUsername = function(accs) {
    accs.forEach(function(acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('')
    })
}
createUsername(accounts);

const updateUI = function(acc) {
    displayMovements(acc.movements);
    calcDisplayBalance(acc);
    calcDisplaySummary(acc)


}

let currentAccount;

//Event handler 
btnLogin.addEventListener('click', function(e) {
    // Prevent form from submitting
    e.preventDefault();

    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    )
    console.log(currentAccount)

    if (currentAccount.pin === Number(inputLoginPin.value)) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;
        // clear input field
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // updade UI
        updateUI(currentAccount)
    }
})

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
    inputTransferAmount.value = inputTransferTo.value = ''

    if (amount > 0 &&
        receiverAcc &&
        currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username) {
        // Doing to Transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        // update UI
        updateUI(currentAccount)
    }
});

btnLoan.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        //  Add movement
        currentAccount.movements.push(amount);

        // Update UI
        updateUI(currentAccount);

    }
    inputLoanAmount.value = '';
});


btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username)
        console.log(index);

        // delete account
        accounts.splice(index, 1)

        // hide UI
        containerApp.style.opacity = 0;
        inputCloseUsername.value = inputClosePin.value = ''
    }

})

let sorted = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
})

// console.log(username);

/*
Don't use chaining method when;
Do not overuse chaining
To chain methods that mutate the underline original array eg.splice, reverse.
*/

// const euToUsd = 1.1;
// // const movementUSD = movements.map(function(mov) {
// //     return mov * euToUsd
// // })
// const movementUSD = movements.map(mov => mov * euToUsd)

// console.log(movements);
// console.log(movementUSD);

// const movementUSDFor = [];
// for (const mov of movements) {
//     movementUSDFor.push(mov * euToUsd)
// }
// console.log(movementUSDFor);

// const movementsDescription = movements.map((mov, i) => {
//         `Movement ${i + 1}: You ${mov > 0 ? 'desposited' : 'withdrew'} ${Math.abs(mov)}`;

//     })
// console.log(movementsDescription);
// const movementsDescription = movements.map((mov, i) => {
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
// })
// console.log(movementsDescription);


const deposits = movements.filter(function(mov) {
    return mov > 0;
})
console.log(movements);
console.log(deposits);

const depositsFor = []
for (const mov of movements)
    if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawal = movements.filter(function(mov) {
    return mov < 0
})
console.log(withdrawal);

// Acculator => Snowball
// const balance = movements.reduce(function(acc, cur, i, arr) {
//     console.log(`Iteration ${i}: ${acc}`);
//     return acc + cur
// }, 0)
// console.log(balance);
// const balance = movements.reduce((acc, cur) => acc + cur, 0)
// console.log(balance);

// let balance2 = 0
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// //Maximum Value
// const max = movements.reduce((acc, mov) => {
//     if (acc > mov)
//         return acc;
//     else
//         return mov;
// }, movements[0]);
// console.log(max);

// const euToUsd = 1.1;
// const totalDepositsUSD = movements
//     .filter(mov => mov > 0)
//     .map(mov => mov * euToUsd)
//     .reduce((acc, mov) => acc + mov, 0)
// console.log(totalDepositsUSD);

const firstWithdrawal = movements.find(mov => mov < 0)
console.log(movements);
console.log(firstWithdrawal);

/*
Differeneces between the find and filter method
filter returns all the elements that match the condition
find returns the first one
filter method returns a new array
find only returns itself and not an array
*/

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account);

// Condition 
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0)
console.log(anyDeposits);

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//Seperate callback
const deposit = mov => mov < 0;
console.log(movements.some(deposits));
console.log(movements.every(deposits));
console.log(movements.filter(deposits));

// Flat and FlatMaps
const arr = [
    [1, 2, 3],
    [4, 5, 6], 7, 8
]
console.log(arr.flat());

const arrDeep = [
    [
        [1, 2], 3
    ],
    [4, [5, 6]], 7, 8
]
console.log(arrDeep.flat(2))

const accountMovements = accounts.map(acc => acc.movements)
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);


const overalBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

//Flatmap
const overalBalance2 = accounts.flatmap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

const owners = ['Jonas', 'Zach', "Adam", 'Martha'];
console.log(owners.sort());
console.log(owners)

// // Numbers
// console.log(movements)

// return < 0 ,A, B (keep order)
// return > 0 ,B, A (switch order)

movements.sort((a, b) => a - b)
console.log(movements);
movements.sort((a, b) => b - a)
console.log(movements);

const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // Empty array + fill method
const x = new Array(7);
console.log(x);

// console.log(x.map(() => 5));
x.fill(1, 3, 5);
x.fill(1)
console.log(x);
arr.fill(23, 4, 6)
console.log(arr2);

// Array.from
const y = Array.from({ length: 7 }, () => 1)
console.log(y);

const z = Array.from({ length: 20 }, (_, i) => i + 1)
console.log(z)




labelBalance.addEventListener('click', function() {
    const movementsUI = Array.from(document.querySelectorAll('.movements__value'),
        el => Number(el.textContent.replace('€', '')))
    console.log(movementsUI.map());

    movementsUI2 = [...document.querySelectorAll('.movements__value')]
})