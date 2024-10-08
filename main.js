window.onload = function () {
  // Отображаем диалоговое окно с подтверждением

  alert("Click to select! Get 50% first! Save Democracy!");
};

let config = {
  containerColorBG: "#353336",
  contentColorBG: "#525053",

  countRows: 7,
  countCols: 5,

  offsetBorder: 10,
  borderRadius: 8,

  gemSize: 64,

  imagesCoin: [
    "images/coins/faceTrump.png",
    "images/coins/gunTrump.png",
    "images/coins/elonTrump.png",
    "images/coins/taylorKamala.png",
    "images/coins/blueKamala.png",
    "images/coins/voteBlueKamala.png",
  ],

  gemClass: "gem",
  gemIdPrefix: "gem",
  gameStates: ["pick", "switch", "revert", "remove", "refill"],
  gameState: "",

  movingItems: 0,

  countScore: 0,
  countScoreTrump: 0,
};

let player = {
  selectedRow: -1,
  selectedCol: -1,
  posX: "",
  posY: "",
};

let components = {
  cursor: document.createElement("div"),
  gems: new Array(),
};
let wrapper = document.querySelector(".wrapper");
let score = document.querySelector(".score");
let scoreTrump = document.querySelector(".scoreTrump");

// start Game
initGame();

// Инициализация всех составляющих игры
function initGame() {
  document.body.style.margin = "0px";
  createCursor();
  createGrid();
  updateScore();

  // Переключаем статус игры на "выбор"
  config.gameState = config.gameStates[0];
}

// Создание курсора для выделения монет
function createCursor() {
  components.cursor.id = "marker";
  components.cursor.style.width = config.gemSize - 10 + "px";
  components.cursor.style.height = config.gemSize - 10 + "px";
  components.cursor.style.border = "5px solid white";
  components.cursor.style.position = "absolute";
  components.cursor.style.zIndex = 2;
  components.cursor.style.display = "none";

  wrapper.append(components.cursor);
}
// Показать курсор
function cursorShow() {
  components.cursor.style.display = "block";
}
// Скрыть курсор
function cursorHide() {
  components.cursor.style.display = "none";
}

// Обновить очки на странице
function updateScore() {
  score.innerHTML = `Kamala: ${config.countScore} %`;
  wrapper.append(score);

  scoreTrump.innerHTML = `Trump: ${config.countScoreTrump} %`;
  wrapper.append(scoreTrump);
}

// Добавление очков
function scoreInc(count, type) {
  if (count >= 3) {
    count *= 2;
  } else if (count >= 5) {
    count = (count + 1) * 2;
  } else if (count >= 6) {
    count *= (count + 2) * 2;
  }

  try {
    if (type.includes("Trump")) {
      config.countScoreTrump += count;
    } else {
      config.countScore += count;
    }
  } catch (error) {
    if (
      confirm("Democracy accidentally failed! Civil war started! (it happens)")
    ) {
      location.reload();
    } else {
      location.reload();
    }
  }
  setVyctoryEffect();
  updateScore();
}

// Создание монеты
function createGem(t, l, row, col, img) {
  let coin = document.createElement("div");
  coin.classList.add("coin");
  coin.classList.add(config.gemClass);
  coin.id = config.gemIdPrefix + "_" + row + "_" + col;
  coin.style.boxSizing = "border-box";
  coin.style.cursor = "pointer";
  coin.style.position = "absolute";
  coin.style.top = t + "px";
  coin.style.left = l + "px";
  coin.style.width = config.gemSize + "px";
  coin.style.height = config.gemSize + "px";
  coin.style.border = "1p solid transparent";
  coin.style.backgroundImage = "url(" + img + ")";
  coin.style.backgroundSize = "100%";

  wrapper.append(coin);
}

function refresh() {
  console.log("refresh");
  createGrid();
}

// Создание и наполнение сетки для монет
function createGrid() {
  document.querySelectorAll(".coin").forEach((coin) => coin.remove());
  // Создание пустой сетки
  for (i = 0; i < config.countRows; i++) {
    components.gems[i] = new Array();
    for (j = 0; j < config.countCols; j++) {
      components.gems[i][j] = -1;
    }
  }

  // Заполняем сетку
  for (i = 0; i < config.countRows; i++) {
    for (j = 0; j < config.countCols; j++) {
      do {
        components.gems[i][j] = Math.floor(
          Math.random() * config.imagesCoin.length
        );
      } while (isStreak(i, j));

      createGem(
        i * config.gemSize,
        j * config.gemSize,
        i,
        j,
        config.imagesCoin[components.gems[i][j]]
      );
    }
  }
}

// Проверка на группу сбора
function isStreak(row, col) {
  return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
}
// Проверка на группу сбора по колонкам
function isVerticalStreak(row, col) {
  let gemValue = components.gems[row][col];

  let streak = 0;
  let tmp = row;

  while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
    streak++;
    tmp--;
  }

  tmp = row;

  while (
    tmp < config.countRows - 1 &&
    components.gems[tmp + 1][col] == gemValue
  ) {
    streak++;
    tmp++;
  }

  return streak > 1;
}
// Проверка на группу сбора по строкам
function isHorizontalStreak(row, col) {
  let gemValue = components.gems[row][col];
  let streak = 0;
  let tmp = col;

  while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
    streak++;
    tmp--;
  }

  tmp = col;

  while (
    tmp < config.countCols - 1 &&
    components.gems[row][tmp + 1] == gemValue
  ) {
    streak++;
    tmp++;
  }

  return streak > 1;
}

// Обработчик клика
function handlerTab(event, target) {
  // Если это элемент с классом config.gameClass
  // и
  // Если подходящее состояние игры
  if (target.classList.contains(config.gemClass) && config.gameStates[0]) {
    // определить строку и столбец
    let row = parseInt(target.getAttribute("id").split("_")[1]);
    let col = parseInt(target.getAttribute("id").split("_")[2]);

    // Выделяем гем курсором
    cursorShow();
    components.cursor.style.top = parseInt(target.style.top) + "px";
    components.cursor.style.left = parseInt(target.style.left) + "px";

    // Если это первый выбор, то сохраняем выбор
    if (player.selectedRow == -1) {
      player.selectedRow = row;
      player.selectedCol = col;
    } else {
      // Если гем находится радом с первым выбором
      // то меняем их местами
      if (
        (Math.abs(player.selectedRow - row) == 1 &&
          player.selectedCol == col) ||
        (Math.abs(player.selectedCol - col) == 1 && player.selectedRow == row)
      ) {
        cursorHide();

        // После выбора меняем состояние игры
        config.gameState = config.gameStates[1];

        // сохранить позицию второго выбранного гема
        player.posX = col;
        player.posY = row;

        // поменять их местами
        gemSwitch();
      } else {
        // Если второй выбор произошел не рядом,
        // то делаем его первым выбором.
        player.selectedRow = row;
        player.selectedCol = col;
      }
    }
  }
}

// Меняем гемы местами
function gemSwitch() {
  let yOffset = player.selectedRow - player.posY;
  let xOffset = player.selectedCol - player.posX;

  // Метка для гемов, которые нужно двигать
  document
    .querySelector(
      "#" +
        config.gemIdPrefix +
        "_" +
        player.selectedRow +
        "_" +
        player.selectedCol
    )
    .classList.add("switch");
  document
    .querySelector(
      "#" +
        config.gemIdPrefix +
        "_" +
        player.selectedRow +
        "_" +
        player.selectedCol
    )
    .setAttribute("dir", "-1");

  document
    .querySelector(
      "#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX
    )
    .classList.add("switch");
  document
    .querySelector(
      "#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX
    )
    .setAttribute("dir", "1");

  // меняем местами гемы
  $(".switch").each(function () {
    config.movingItems++;

    $(this).animate(
      {
        left: "+=" + xOffset * config.gemSize * $(this).attr("dir"),
        top: "+=" + yOffset * config.gemSize * $(this).attr("dir"),
      },
      {
        duration: 250,
        complete: function () {
          //Проверяем доступность данного хода
          checkMoving();
        },
      }
    );

    $(this).removeClass("switch");
  });

  // поменять идентификаторы гемов
  document
    .querySelector(
      "#" +
        config.gemIdPrefix +
        "_" +
        player.selectedRow +
        "_" +
        player.selectedCol
    )
    .setAttribute("id", "temp");
  document
    .querySelector(
      "#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX
    )
    .setAttribute(
      "id",
      config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol
    );
  document
    .querySelector("#temp")
    .setAttribute(
      "id",
      config.gemIdPrefix + "_" + player.posY + "_" + player.posX
    );

  // поменять гемы в сетке
  let temp = components.gems[player.selectedRow][player.selectedCol];
  components.gems[player.selectedRow][player.selectedCol] =
    components.gems[player.posY][player.posX];
  components.gems[player.posY][player.posX] = temp;
}

// Проверка перемещенных гемов
function checkMoving() {
  config.movingItems--;

  // Действуем тольпо после всех перемещений
  if (config.movingItems == 0) {
    // Действия в зависимости от состояния игры
    switch (config.gameState) {
      // После передвижения гемов проверяем на появление групп сбора
      case config.gameStates[1]:
      case config.gameStates[2]:
        // проверяем, появились ли группы сбора
        if (
          !isStreak(player.selectedRow, player.selectedCol) &&
          !isStreak(player.posY, player.posX)
        ) {
          // Если групп сбора нет, нужно отменить совершенное движение
          // а если действие уже отменяется, то вернуться к исходному состоянию ожидания выбора
          if (config.gameState != config.gameStates[2]) {
            config.gameState = config.gameStates[2];
            gemSwitch();
          } else {
            config.gameState = config.gameStates[0];
            player.selectedRow = -1;
            player.selectedCol = -1;
          }
        } else {
          // Если группы сбора есть, нужно их удалить
          let gemValue =
            components.gems[player.selectedRow][player.selectedCol];
          if (config.imagesCoin[gemValue]) {
            console.log("gemValue", gemValue);
            console.log(
              "config.imagesCoin[gemValue]",
              config.imagesCoin[gemValue]
            );
            let removedGemType = config.imagesCoin[gemValue]
              .split("/")
              .pop()
              .split(".")[0];
            setEffect(removedGemType);
          }
          config.gameState = config.gameStates[3];

          // Отметим все удаляемые гемы
          if (isStreak(player.selectedRow, player.selectedCol)) {
            removeGems(player.selectedRow, player.selectedCol);
          }

          if (isStreak(player.posY, player.posX)) {
            removeGems(player.posY, player.posX);
          }

          // Убираем с поля
          gemFade();
        }
        break;
      // После удаления нужно заполнить пустоту
      case config.gameStates[3]:
        checkFalling();
        break;
      case config.gameStates[4]:
        placeNewGems();
        break;
    }
  }
}

async function setVyctoryEffect() {
  const container = document.getElementById("container");

  // Создание нового изображения
  let img = new Image();
  img.style.position = "fixed";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.zIndex = "3";
  img.style.width = "100%";
  container.appendChild(img);

  // Проверка условий
  if (config.countScoreTrump >= 50) {
    // Массив путей к изображениям для победы Трампа
    const trumpImages = [
      "images/victoryEffects/trump/trumpWins1.png",
      "images/victoryEffects/trump/trumpWins2.png",
      "images/victoryEffects/trump/trumpWins3.png",
      "images/victoryEffects/trump/trumpWins4.png",
      "images/victoryEffects/trump/trumpWins5.png",
      "images/victoryEffects/trump/trumpWins6.png",
    ];

    // Последовательный показ изображений и затем гифки boom
    await showVictorySequence(img, trumpImages, "images/effects/boom.gif");
    alert("Trump wins! Share your vote! Send this game to your friends!");
  } else if (config.countScore >= 50) {
    // Массив путей к изображениям для обычной победы
    const regularImages = [
      "images/victoryEffects/kamala/kamalaWins1.png",
      "images/victoryEffects/kamala/kamalaWins2.png",
      "images/victoryEffects/kamala/kamalaWins3.png",
      "images/victoryEffects/kamala/kamalaWins4.png",
      "images/victoryEffects/kamala/kamalaWins5.png",
      "images/victoryEffects/kamala/kamalaWins6.png",
    ];

    // Последовательный показ изображений и затем альтернативной гифки
    await showVictorySequence(img, regularImages, "images/effects/gayKiss.gif");
    alert("Kamala wins! Share your vote! Send this game to your friends!");
  }

  // Удаление изображения из DOM после завершения показа
  container.removeChild(img);
}

// Функция для последовательного показа изображений и финальной гифки
async function showVictorySequence(imgElement, imageArray, finalGif) {
  for (let i = 0; i < imageArray.length; i++) {
    imgElement.src = imageArray[i];

    // Время задержки для каждой картинки
    let displayTime;
    if (i === 0 || i === imageArray.length - 1) {
      displayTime = 1000; // Первая и последняя картинки показываются по 1 секунде
    } else {
      displayTime = Math.max(100, 1000 - i * 100); // Промежуточные показываются с уменьшением на 0.2 секунды
    }

    await delay(displayTime); // Ожидание перед переключением изображения
  }

  // Показ финальной гифки
  imgElement.src = finalGif;
  await delay(2000); // Показ финальной гифки 2 секунды
}

// Вспомогательная функция для ожидания указанного времени
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Вспомогательная функция для ожидания указанного времени
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Глобальная переменная для отслеживания оставшихся эффектов
let remainingEffects = [];

// Функция, которая случайно выбирает изображение и гарантирует, что эффекты не повторяются, пока не закончатся
function setEffect(removedGemType) {
  // Массив с путями ко всем эффектам
  const effectsArray = [
    "images/effects/911.gif",
    "images/effects/kamalaInteresting.webp",
    "images/effects/trump.gif",
    "images/effects/trumpToilet.gif",
    "images/effects/bidenSheIsGood.gif",
    "images/effects/kamalaLenin.webp",
    "images/effects/trumpEatsdogs.webp",
    "images/effects/trumpWall.webp",
    "images/effects/kamalaLiberalElite.webp",
    "images/effects/trumpGlitch.webp",
    "images/effects/trumpww3.webp",
    "images/effects/chinaEatsYourLunch.webp",
    "images/effects/kamalaMarks.webp",
    "images/effects/trumpMetro.webp",
    "images/effects/elonHigh.gif",
    "images/effects/kamalaNuke.gif",
    "images/effects/trumpPutin.webp",
    "images/effects/putin.gif",
    "images/effects/trumpSpeaks.webp",
    "images/effects/kamalaBidenShow.webp",
  ];

  // Если все эффекты были использованы, сбросить массив оставшихся эффектов
  if (remainingEffects.length === 0) {
    remainingEffects = [...effectsArray]; // Копируем исходный массив
  }

  // Выбор случайного индекса из оставшихся эффектов
  const randomIndex = Math.floor(Math.random() * remainingEffects.length);

  // Извлечение эффекта и удаление его из оставшихся
  const chosenEffect = remainingEffects.splice(randomIndex, 1)[0];

  // Создание нового изображения
  let img = new Image();
  img.src = chosenEffect;

  // Стиль изображения
  img.style.position = "fixed";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.width = "50%";
  img.style.zIndex = "2";
  if (window.innerWidth <= 768) {
    img.style.width = "100%";
  }

  // Добавление изображения в контейнер
  document.getElementById("container").appendChild(img);

  // Удаление изображения через 1.8 секунды
  setTimeout(() => {
    document.getElementById("container").removeChild(img);
  }, 1800);
}

// Отмечаем элементы для удаления и убираем их из сетки
function removeGems(row, col) {
  let gemValue = components.gems[row][col];
  let tmp = row;

  document
    .querySelector("#" + config.gemIdPrefix + "_" + row + "_" + col)
    .classList.add("remove");
  let countRemoveGem = document.querySelectorAll(".remove").length;

  if (isVerticalStreak(row, col)) {
    while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
      document
        .querySelector("#" + config.gemIdPrefix + "_" + (tmp - 1) + "_" + col)
        .classList.add("remove");
      components.gems[tmp - 1][col] = -1;
      tmp--;
      countRemoveGem++;
    }

    tmp = row;

    while (
      tmp < config.countRows - 1 &&
      components.gems[tmp + 1][col] == gemValue
    ) {
      document
        .querySelector("#" + config.gemIdPrefix + "_" + (tmp + 1) + "_" + col)
        .classList.add("remove");
      components.gems[tmp + 1][col] = -1;
      tmp++;
      countRemoveGem++;
    }
  }

  if (isHorizontalStreak(row, col)) {
    tmp = col;

    while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
      document
        .querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp - 1))
        .classList.add("remove");
      components.gems[row][tmp - 1] = -1;
      tmp--;
      countRemoveGem++;
    }

    tmp = col;

    while (
      tmp < config.countCols - 1 &&
      components.gems[row][tmp + 1] == gemValue
    ) {
      document
        .querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp + 1))
        .classList.add("remove");
      components.gems[row][tmp + 1] = -1;
      tmp++;
      countRemoveGem++;
    }
  }
  console.log(
    "config.imagesCoin[components.gems[row][col]]",
    config.imagesCoin[components.gems[row][col]]
  );
  components.gems[row][col] = -1;
  console.log("config.imagesCoin[gemValue]", config.imagesCoin[gemValue]);

  let removedGemImage = config.imagesCoin[gemValue];
  scoreInc(countRemoveGem, removedGemImage);
}

// Удаляем гемы
function gemFade() {
  $(".remove").each(function () {
    config.movingItems++;

    $(this).animate(
      {
        opacity: 0,
      },
      {
        duration: 200,
        complete: function () {
          $(this).remove();
          checkMoving();
        },
      }
    );
  });
}

// Заполняем пустоту
function checkFalling() {
  let fellDown = 0;

  for (j = 0; j < config.countCols; j++) {
    for (i = config.countRows - 1; i > 0; i--) {
      if (components.gems[i][j] == -1 && components.gems[i - 1][j] >= 0) {
        document
          .querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j)
          .classList.add("fall");
        document
          .querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j)
          .setAttribute("id", config.gemIdPrefix + "_" + i + "_" + j);
        components.gems[i][j] = components.gems[i - 1][j];
        components.gems[i - 1][j] = -1;
        fellDown++;
      }
    }
  }

  $(".fall").each(function () {
    config.movingItems++;

    $(this).animate(
      {
        top: "+=" + config.gemSize,
      },
      {
        duration: 100,
        complete: function () {
          $(this).removeClass("fall");
          checkMoving();
        },
      }
    );
  });

  // Если все элементы передвинули,
  // то сменить состояние игры
  if (fellDown == 0) {
    config.gameState = config.gameStates[4];
    config.movingItems = 1;
    checkMoving();
  }
}

// Создание новых гемов
function placeNewGems() {
  let gemsPlaced = 0;

  // Поиск мест, в которых необходимо создать гем
  for (i = 0; i < config.countCols; i++) {
    if (components.gems[0][i] == -1) {
      components.gems[0][i] = Math.floor(
        Math.random() * config.imagesCoin.length
      );

      createGem(
        0,
        i * config.gemSize,
        0,
        i,
        config.imagesCoin[components.gems[0][i]]
      );
      gemsPlaced++;
    }
  }

  // Если мы создали гемы, то проверяем необходимость их сдвинуть вниз.
  if (gemsPlaced) {
    config.gameState = config.gameStates[3];
    checkFalling();
  } else {
    // Проверка на группы сбора
    let combo = 0;

    for (i = 0; i < config.countRows; i++) {
      for (j = 0; j < config.countCols; j++) {
        if (
          j <= config.countCols - 3 &&
          components.gems[i][j] == components.gems[i][j + 1] &&
          components.gems[i][j] == components.gems[i][j + 2]
        ) {
          combo++;
          removeGems(i, j);
        }
        if (
          i <= config.countRows - 3 &&
          components.gems[i][j] == components.gems[i + 1][j] &&
          components.gems[i][j] == components.gems[i + 2][j]
        ) {
          combo++;
          removeGems(i, j);
        }
      }
    }

    // удаляем найденные группы сбора
    if (combo > 0) {
      config.gameState = config.gameStates[3];
      gemFade();
    } else {
      // Запускаем основное состояние игры
      config.gameState = config.gameStates[0];
      player.selectedRow = -1;
    }
  }
}
