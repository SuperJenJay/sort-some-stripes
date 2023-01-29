const gauge = document.querySelector('#gauge');
const speedGauge = document.querySelector('#speed');
const button = document.querySelector('#sort');
const checkButton = document.querySelector('#check');
const checkbox = document.querySelector('#checkbox');
const numberText = document.querySelector('#numberText');
const container = document.getElementById('container');
const isSorted = document.querySelector('#isSorted');
const speedText = document.querySelector('#speedText');
const select = document.querySelector('select');
const toolbar = document.querySelector('.toolbar');
let speed = 15;
let valueArray = [];

function fetch() {
  numberText.textContent = `Number of elements: ${gauge.value}`;
  if (container.childElementCount < gauge.value) {
    createAndAppend();
  } else if (container.childElementCount > gauge.value) {
    container.removeChild(container.children[container.children.length - 1]);
  } else {
    // console.log(`Gauge value: ${gauge.value}`)
    // console.log(`Number of elements in container: ${container.childElementCount}`)
    return;
  }
  fetch();
}

function swap(node1, node2) {
  const afterNode2 = node2.nextElementSibling;
  const parent = node2.parentNode;
  node1.replaceWith(node2);
  parent.insertBefore(node1, afterNode2);
}

function arrayFromContainer() {
  const masterArray = [];
  for (let i = 0; i < container.childElementCount; i++) {
    masterArray.push({
      position: i,
      value: container.children[i].getAttribute('value'),
    });
  }
  return masterArray;
}

async function animateFromReference(masterReferenceArray) {
  for (let p = 0; p < masterReferenceArray.length; p++) {
    for (let r = 0; r < masterReferenceArray[p].length; r++) {
      masterReferenceArray[p][r].style.border = '2px solid white';
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, speed);
      });
      container.insertBefore(
        masterReferenceArray[p][r],
        container.children[r + 1]
      );
      masterReferenceArray[p][r].style.border = 'none';
    }
  }
}

async function check() {
  for (let i = 1; i < container.childElementCount - 1; i++) {
    container.children[i - 1].style.border = 'white 2px solid';
    container.children[i].style.border = 'white 2px solid';
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, speed);
    });
    if (
      +container.children[i - 1].getAttribute('value') >
      +container.children[i].getAttribute('value')
    ) {
      container.children[i - 1].style.border = 'none';
      container.children[i].style.border = 'none';
      isSorted.style.backgroundColor = 'red';
      return;
    }
    container.children[i - 1].style.border = 'none';
    container.children[i].style.border = 'none';
  }
  isSorted.style.backgroundColor = 'green';
}

const addRandomValueToArray = () => {
  let randomValue = (Math.random() * 100).toFixed(2);
  if (randomValue == 100) {
    randomValue -= 0.01;
  }
  if (valueArray.indexOf(randomValue) !== -1) {
    addRandomValueToArray();
  } else {
    valueArray.push(randomValue);
  }
};

const createAndAppend = (array) => {
  for (let i = 0; i < array.length; i++) {
    const v = array[i];
    const newItem = document.createElement('div');
    newItem.classList.add('box');
    newItem.style.backgroundColor = `rgb(${Math.floor(
      Math.random() * 256
    )},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
    newItem.setAttribute('value', v);
    newItem.style.height = `${v}%`;
    container.appendChild(newItem);
  }
};

const init = () => {
  valueArray = [];
  for (let i = 1; i <= +gauge.value; i++) {
    if (checkbox.checked) {
      addRandomValueToArray();
    } else {
      valueArray.push(((100 / +gauge.value) * i - 0.01).toFixed(2));
    }
    valueArray = shuffle(valueArray);
  }
  createAndAppend(valueArray);
};

const resetNumber = () => {
  numberText.textContent = `Number of elements: ${gauge.value}`;
  container.replaceChildren();
  valueArray = [];
  init();
};

const resetSpeed = () => {
  speed = speedGauge.value;
  speedText.textContent = `Step duration [ms]: ${speed}`;
};

const sort = async function (sortName) {
  isSorted.style.backgroundColor = 'black';
  await sortName();
  await check();
};

const sortType = async function () {
  switch (select.value) {
    case 'BUBBLE':
      await sort(bubbleSort);
      break;
    case 'SELECTION':
      await sort(selectionSort);
      break;
    case 'QUICK':
      await sort(quickSort);
      break;
    case 'INSERTION':
      await sort(insertionSort);
      break;
    case 'MERGE':
      await sort(mergeSort);
      break;
    case 'RADIX':
      await sort(radixSort);
      break;
    case 'COMB':
      await sort(combSort);
      break;
  }
};

function shuffle(arr) {
  let i = arr.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
  }
  return arr;
}

async function bubbleSort() {
  toolbar.style.pointerEvents = 'none';
  for (let j = 1; j <= container.childElementCount; j++) {
    for (let i = 0; i < container.childElementCount - j; i++) {
      container.children[i].style.border = '2px solid white';
      container.children[i + 1].style.border = '2px solid white';
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, speed);
      });
      if (
        +container.children[i].getAttribute('value') >
        +container.children[i + 1].getAttribute('value')
      ) {
        swap(container.children[i], container.children[i + 1]);
      }
      container.children[i].style.border = 'none';
      container.children[i + 1].style.border = 'none';
    }
  }
  toolbar.style.pointerEvents = 'all';
}

async function selectionSort() {
  toolbar.style.pointerEvents = 'none';
  let curDiv;
  for (let i = 0; i < container.childElementCount - 1; i++) {
    curDiv = container.children[i];
    for (let j = i + 1; j < container.childElementCount; j++) {
      curDiv.style.border = '2px solid white';
      container.children[j].style.border = '2px solid white';
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, speed);
      });
      if (
        +curDiv.getAttribute('value') >
        +container.children[j].getAttribute('value')
      ) {
        curDiv.style.border = 'none';
        curDiv = container.children[j];
      } else {
        container.children[j].style.border = 'none';
      }
    }
    swap(container.children[i], curDiv);
    curDiv.style.border = 'none';
  }
  toolbar.style.pointerEvents = 'all';
}

async function quickSort(array = arrayFromContainer()) {
  toolbar.style.pointerEvents = 'none';
  let h;
  if (array.length == 1 || array.length == 0) {
    return;
  }
  if (array.length == 2) {
    if (+array[0].value > +array[1].value) {
      swap(
        container.children[array[0].position],
        container.children[array[1].position]
      );
      h = array[0].value;
      array[0].value = array[1].value;
      array[1].value = h;
    }
    return;
  }
  let pivotNode = container.children[array[array.length - 1].position];
  pivotNode.style.border = '2px solid white';
  let pivot = array[array.length - 1];
  let i = 0;
  let j = 1;
  let firstProductArray = [];
  let secondProductArray = [];
  while (array[i] !== array[array.length - 1 - j] && i < array.length - 1 - j) {
    container.children[array[i].position].style.border = '2px solid white';
    container.children[array[array.length - 1 - j].position].style.border =
      '2px solid white';
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, speed);
    });
    container.children[array[i].position].style.border = 'none';
    container.children[array[array.length - 1 - j].position].style.border =
      'none';
    if (
      +array[i].value > +pivot.value &&
      +array[array.length - 1 - j].value < +pivot.value
    ) {
      swap(
        container.children[array[i].position],
        container.children[array[array.length - 1 - j].position]
      );
      h = array[i].value;
      array[i].value = array[array.length - 1 - j].value;
      array[array.length - 1 - j].value = h;
      i++;
      j++;
    } else if (+array[i].value < +pivot.value) {
      i++;
    } else if (+array[array.length - 1 - j].value > +pivot.value) {
      j++;
    }
  }
  if (+array[array.length - 1].value < +array[array.length - 1 - j].value) {
    for (let k = 0; k < array.length - 1 - j; k++) {
      firstProductArray.push(array[k]);
    }
    for (let l = array.length - j; l <= array.length - 1; l++) {
      secondProductArray.push(array[l]);
    }
    container.insertBefore(
      container.children[array[array.length - 1].position],
      container.children[array[array.length - 1 - j].position]
    );
    h = array[array.length - 1].value;
    for (let n = array.length - 2; n >= array.length - 1 - j; n--) {
      array[n + 1].value = array[n].value;
    }
    array[array.length - 1 - j].value = h;
  } else {
    for (let k = 0; k < array.length - j; k++) {
      firstProductArray.push(array[k]);
    }
    for (let l = array.length - j + 1; l <= array.length - 1; l++) {
      secondProductArray.push(array[l]);
    }
    container.insertBefore(
      container.children[array[array.length - 1].position],
      container.children[array[array.length - j].position]
    );
    h = array[array.length - 1].value;
    for (let n = array.length - 2; n >= array.length - j; n--) {
      array[n + 1].value = array[n].value;
    }
    array[array.length - j].value = h;
  }
  pivotNode.style.border = 'none';
  await quickSort(firstProductArray);
  await quickSort(secondProductArray);
  toolbar.style.pointerEvents = 'all';
}

async function insertionSort() {
  toolbar.style.pointerEvents = 'none';
  for (let i = 1; i <= container.childElementCount - 1; i++) {
    let item = container.children[i];
    item.style.border = '2px solid white';
    for (let j = 1; j <= i; j++) {
      item.previousSibling.style.border = '2px solid white';
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, speed);
      });
      item.previousSibling.style.border = 'none';
      if (
        +item.getAttribute('value') <
        +item.previousSibling.getAttribute('value')
      ) {
        swap(item.previousSibling, item);
      } else {
        break;
      }
    }
    item.style.border = 'none';
  }
  toolbar.style.pointerEvents = 'all';
}

async function mergeSort() {
  toolbar.style.pointerEvents = 'none';
  let masterReferenceArray = [];
  let masterArray = [];
  for (let i = 0; i < container.childElementCount; i++) {
    masterArray.push([arrayFromContainer()[i]]);
  }
  while (masterArray.length > 1) {
    let newMasterArray = [];
    let referenceArray = [];
    for (let j = 0; j < masterArray.length / 2; j++) {
      if (masterArray[2 * j + 1]) {
        let m = 0;
        let n = 0;
        let mergedItem = [];
        while (
          m < masterArray[2 * j].length ||
          n < masterArray[2 * j + 1].length
        ) {
          if (masterArray[2 * j][m] && masterArray[2 * j + 1][n]) {
            if (
              +masterArray[2 * j][m].value < +masterArray[2 * j + 1][n].value
            ) {
              mergedItem.push(masterArray[2 * j][m]);
              m++;
            } else {
              mergedItem.push(masterArray[2 * j + 1][n]);
              n++;
            }
          } else if (!masterArray[2 * j + 1][n]) {
            mergedItem.push(masterArray[2 * j][m]);
            m++;
          } else {
            mergedItem.push(masterArray[2 * j + 1][n]);
            n++;
          }
        }
        for (let k = 0; k < mergedItem.length; k++) {
          referenceArray.push(container.children[mergedItem[k].position]);
        }
        newMasterArray.push(mergedItem);
      } else {
        for (let k = 0; k < masterArray[2 * j].length; k++) {
          referenceArray.push(
            container.children[masterArray[2 * j][k].position]
          );
        }
        newMasterArray.push(masterArray[2 * j]);
      }
    }
    masterReferenceArray.push(referenceArray);
    masterArray = newMasterArray;
  }
  await animateFromReference(masterReferenceArray);
  toolbar.style.pointerEvents = 'all';
}

async function radixSort() {
  toolbar.style.pointerEvents = 'none';
  let masterArray = arrayFromContainer();
  let referenceArray;
  let masterReferenceArray = [[], [], [], []];
  for (let i = 0; i < 4; i++) {
    referenceArray = [[], [], [], [], [], [], [], [], [], []];
    for (let j = 0; j < masterArray.length; j++) {
      switch (Math.floor(+masterArray[j].value * Math.pow(10, 2 - i)) % 10) {
        case 0:
          referenceArray[0].push(masterArray[j]);
          break;
        case 1:
          referenceArray[1].push(masterArray[j]);
          break;
        case 2:
          referenceArray[2].push(masterArray[j]);
          break;
        case 3:
          referenceArray[3].push(masterArray[j]);
          break;
        case 4:
          referenceArray[4].push(masterArray[j]);
          break;
        case 5:
          referenceArray[5].push(masterArray[j]);
          break;
        case 6:
          referenceArray[6].push(masterArray[j]);
          break;
        case 7:
          referenceArray[7].push(masterArray[j]);
          break;
        case 8:
          referenceArray[8].push(masterArray[j]);
          break;
        case 9:
          referenceArray[9].push(masterArray[j]);
          break;
      }
    }
    for (let k = 0; k < referenceArray.length; k++) {
      if (k === 0) {
        masterReferenceArray[i] = referenceArray[k];
      } else {
        masterReferenceArray[i] = masterReferenceArray[i].concat(
          referenceArray[k]
        );
      }
    }
    masterArray = masterReferenceArray[i];
  }
  for (let m = 0; m < masterReferenceArray.length; m++) {
    for (let n = 0; n < container.childElementCount; n++) {
      let child = container.children[masterReferenceArray[m][n].position];
      masterReferenceArray[m][n] = child;
    }
  }
  await animateFromReference(masterReferenceArray);
  toolbar.style.pointerEvents = 'all';
}

async function combSort() {
  toolbar.style.pointerEvents = 'none';
  let oneMore = true;
  let gap = Math.floor(container.childElementCount / 1.3);
  while (oneMore) {
    if (gap === 0) {
      gap = 1;
      oneMore = false;
    }
    for (let i = 0; i < container.childElementCount - gap; i++) {
      container.children[i].style.border = '2px solid white';
      container.children[i + gap].style.border = '2px solid white';
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, speed);
      });
      if (
        +container.children[i].getAttribute('value') >
        +container.children[i + gap].getAttribute('value')
      ) {
        swap(container.children[i], container.children[i + gap]);
      }
      container.children[i].style.border = 'none';
      container.children[i + gap].style.border = 'none';
    }
    gap = Math.floor(gap / 1.3);
  }
  toolbar.style.pointerEvents = 'all';
}

button.addEventListener('click', sortType);
checkButton.addEventListener('click', check);
gauge.addEventListener('input', resetNumber);
speedGauge.addEventListener('input', resetSpeed);
checkbox.addEventListener('input', resetNumber);

init();