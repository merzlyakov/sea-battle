'use strict'

var battleWidth = 10,
	battleHeight = 10,
	SIZE_CELL =40,
	PAD_MAR = 2; // padding - margin

var battleArrayLeft,
	battleArrayRight,
	fleetLeft,
	fleetRight,
	rotationPlayers,
	playerOne,
	playerTwo,
	stopGame,
	judge; 


start();

processGame();

function processGame() {

	if (((playerOne.human == 1) && (playerTwo.human == 1)) || (rotationPlayers == 0) ||
		((playerOne.human == 0) && (playerTwo.human == 1) && (rotationPlayers == 2)) ||
		((playerTwo.human == 0) && (playerOne.human == 1) && (rotationPlayers == 1))) {
		return;
	}
	artificialIntellingence();
}

function start() {
	createPlayers();

	battleFieldConstruction(); // Создание связанных полей и массивов

	constructionFleetsAndBalanceOfPower(); // построение флотилий
	
	constructionBattleInformation(); // информация по флотилиям и ходам

	createJudgeSelector();

	//startBattle();

	//stopComp();

	//arrayLeftAndRight();
}

function arrayLeftAndRight() {
	var buttonLeftArray = document.createElement('div');
	buttonLeftArray.style.backgroundColor = "#aaa";
	buttonLeftArray.style.display = "inline-block";
	buttonLeftArray.innerHTML = "Left";
	buttonLeftArray.onclick = function() {
		var str = "";
		for(var i = 1; i < battleArrayLeft.length - 1; i++) {
			for(var j = 1; j < battleArrayLeft[i].length - 1; j++) {
				if (battleArrayLeft[i][j].ship != "K") {
					str += battleArrayLeft[i][j].ship + " , ";
				} else {
					str += battleArrayLeft[i][j].ship + ", ";
				}
			}
			str += "</br>";
		}
		buttonLeftArray.innerHTML = str;
	}
	document.body.appendChild(buttonLeftArray);

	var LR = document.createElement('div');
	LR.style.backgroundColor = "#fff";
	LR.style.display = "inline-block";
	LR.innerHTML = "LR";
	document.body.appendChild(LR);

	var buttonRightArray = document.createElement('div');
	buttonRightArray.style.backgroundColor = "#777";
	buttonRightArray.style.display = "inline-block";
	buttonRightArray.innerHTML = "Right";
	buttonRightArray.onclick = function() {
		var str = "";
		for(var i = 1; i < battleArrayRight.length - 1; i++) {
			for(var j = 1; j < battleArrayRight[i].length - 1; j++) {
				if (battleArrayLeft[i][j].ship != "K") {
					str += battleArrayLeft[i][j].ship + " , ";
				} else {
					str += battleArrayLeft[i][j].ship + ", ";
				}			
			}
			str += "</br>";
		}
		buttonRightArray.innerHTML = str;
	}
	document.body.appendChild(buttonRightArray);

	stopGame = 0;
}

function startBattle() {
	stopGame = 1;
	var buttonstartBattle = document.createElement('div');
	buttonstartBattle.style.backgroundColor = "#777";
	buttonstartBattle.innerHTML = "Start";
	buttonstartBattle.onclick = function() {
		var firstElementBody = document.body.children[0];
		document.body.innerHTML = "";
		document.body.appendChild(firstElementBody);
		var sea = document.getElementById('battle');
		sea.innerHTML = "";
		start();
	}
	document.body.appendChild(buttonstartBattle);
}

function stopComp() {
	var buttonStop = document.createElement('div');
	buttonStop.style.backgroundColor = "#777";
	buttonStop.innerHTML = "Stop";
	buttonStop.onclick = function() {
		stopGame = 1;
	}
	document.body.appendChild(buttonStop);
}

function createPlayers() {
	battleArrayLeft = [];
	battleArrayRight = [];
	rotationPlayers = Math.round(Math.random()) + 1;
	var countPlayers = 0;
	playerOne = new Player(1, "Владимир", battleArrayLeft);
	playerTwo = new Player(0, "Компьютер", battleArrayRight);
	playerOne.otherPlayer = playerTwo;
	playerTwo.otherPlayer = playerOne;

	function Player(human, name, arr) {
		countPlayers++;
		var player = {"human": human, 		// 1 - человек; 0 - компьютер
						"name": name,
						"array": arr,};
		if (player.human == 0) {
			player.computer = {target: {hit: 0,
										hitAgain: 0,
										Horizontal: 0,
										changeHorizont: 0,
										direction: 0,
										changeDirection: 0,
										changePossible: 1,
										coorX: 0,
										coorY: 0,
										coorXnext: 0,
										coorYnext: 0,
										toString: function() {
											return " " + this.hit + " " + this.hitAgain + " " + this.Horizontal + " " +
											this.changeHorizont + " " + this.direction + " " + this.changeDirection + " " +
											this.coorX + " " + this.coorY + " " + this.coorXnext + " " + this.coorYnext}},
								"name": ("Компьютер №" + countPlayers)}
		}
		return player;
	}
}

function createJudgeSelector() {
	judge = {fleets: {},};
	judge.fleets.left = fleetLeft;
	judge.fleets.right = fleetRight;
	rotationSelect();	
}

function rotationSelect() {
	var selector = document.getElementById("selector");
	if (rotationPlayers == 2) {
		selectSquare("squareLeft", "squareRight");
		selector.style.background = "url(image/bs-background-left.png) #a7d4d1";
		if (playerTwo.human == 0) {selector.innerHTML = "Ходит</br>компьютер №2";}
		else {selector.innerHTML = "Атакуем!";}
	} else {
		selectSquare("squareRight", "squareLeft");
		selector.style.background = "url(image/bs-background-right.png) #a7d4d1";
		if (playerOne.human == 0) {selector.innerHTML = "Ходит</br>компьютер №1";}
		else {selector.innerHTML = "Атакуем!";}
	}

	function selectSquare(squareSelect, squareNotSelect) {
		var square = document.getElementById(squareSelect);
		square.style.boxShadow = " 0 0 15px #b7410e";
		square = document.getElementById(squareNotSelect);
		square.style.boxShadow = "none";	
	}
}

function constructionBattleInformation() {
	var sea = document.getElementById('battle');

	informationBarCenter();
	informBarFleets();

	function informBarFleets() {
		var part = document.createElement('div');
		sea.appendChild(part);

		var informFleetLeft = createInformFleetPart();
		var informFleetRight = createInformFleetPart();
		informFleetRight.style.float = "right";

		createInfBar(informFleetLeft, false, "leftLoss");
		createInfBar(informFleetRight, true, "rightLoss");

		function createInfBar(InformFleet, flag, idName) {
			var infBarFleet = createInformBarFleet(fleetLeft.count,
														"Начальный остав флота:");
			if (flag) {infBarFleet.style.float = "right";}
			InformFleet.appendChild(infBarFleet);
			infBarFleet = createInformBarFleet(fleetLeft.loss,
														"Потери флота:");
			if (!flag) {infBarFleet.style.float = "right";}
			infBarFleet.id = idName;
			InformFleet.appendChild(infBarFleet);
		}

		function createInformFleetPart() {
			var informFleetPart = document.createElement('div');
			informFleetPart.style.width = ((battleWidth + 1) * SIZE_CELL + "px");
			informFleetPart.style.minWidth = (SIZE_CELL * 10 + "px");
			informFleetPart.style.display = "inline-block";
			informFleetPart.style.margin = "5px 0 0 0";
			part.appendChild(informFleetPart);
			return informFleetPart;
		}

		function createInformBarFleet(fleet, name) {
			var informBarFleet = document.createElement('div');
			informBarFleetStyle();
			var newDivInBarFleet = document.createElement('div');
			newDivInBarFleet.innerHTML = (name);
			newDivInBarFleet.style.backgroundColor = "#cae3e0";
			informBarFleet.appendChild(newDivInBarFleet);
			for (var key in fleet) {
				newDivInBarFleet = document.createElement('div');
				if (key == "total") {
					newDivInBarFleet.innerHTML = ("Общее количество: " + 
											fleet[key] + " ед.");
				} else {newDivInBarFleet.innerHTML = ("" + key + ": " + 
											fleet[key] + " ед.");
				}
				informBarFleet.appendChild(newDivInBarFleet);
			}
			return informBarFleet;

			function informBarFleetStyle() {
				informBarFleet.style.widthMin = (SIZE_CELL * 4 + "px");
				informBarFleet.style.display = "inline-block";
				informBarFleet.style.border = "solid 2px";
				informBarFleet.style.borderRadius = "5px";
				informBarFleet.style.borderColor = "#84c3be";
				informBarFleet.style.position = "relative";
				informBarFleet.style.margin = "0px 0px 0px 0px";
				informBarFleet.style.padding = "0px 10px";
				informBarFleet.style.backgroundColor = "#a7d4d1";
				informBarFleet.style.fontSize = ((SIZE_CELL - PAD_MAR *4) / 2 + "px");
				informBarFleet.id = "informBarFleet";
			}
		}
	}

	function informationBarCenter() {
		var contanerInformBar = document.createElement('div');
		contaner();

		function contaner() {
			contanerInformBar.style.display = "inline-block";
			contanerInformBar.style.verticalAlign = "top";
			sea.insertBefore(contanerInformBar, sea.children[1]);

			topInformBar();

			logInform();
			
			messagerAndSelectBar();

			function topInformBar() {
				var topInform = document.createElement('div');
				topInform.innerHTML = "<span> Ход боя: </span>";
				topInform.style.textAlign = "center";
				topInform.style.margin = "0px 5px 0px 5px";
				contanerInformBar.appendChild(topInform);

				var colapseInformBar = document.createElement('div');
				colapseInformBarStyle();
				var revers = reversSizeBar();
				colapseInformBar.onclick = revers;

				topInform.appendChild(colapseInformBar);

				function colapseInformBarStyle() {
					colapseInformBar.style.height = "14px";
					colapseInformBar.style.width = "15px";
					colapseInformBar.style.display = "inline-block";
					colapseInformBar.style.borderColor = "#84c3be";
					colapseInformBar.style.border = "solid 2px";
					colapseInformBar.style.borderRadius = "3px";
					colapseInformBar.style.borderColor = "#84c3be";
					colapseInformBar.style.background = "url(image/collapse-up.png)";
					/*colapseInformBar.style.position = "relative";
					colapseInformBar.style.right = "-50px";*/
					colapseInformBar.style.float = "right";
					colapseInformBar.style.verticalAlign = "bottom";
					colapseInformBar.style.margin = "0px 12px 2px 0px";
					colapseInformBar.style.transition = "0.2s linear";
					colapseInformBar.id = "colapseInformBar";
				}

				function reversSizeBar() {
					var statusBar = 1;
					return function() {
						var log = document.getElementById('informBar');
						var colapseInformBar = document.getElementById('colapseInformBar');

						if (statusBar > 0) {
							informBar.style.height = (SIZE_CELL / 2 + "px");
							colapseInformBar.style.background = "url(image/collapse-down.png)";
							log.scrollTop += 100;
						} else {
							informBar.style.height = (SIZE_CELL * 3 + "px");
							colapseInformBar.style.background = "url(image/collapse-up.png)";
						}
						statusBar *= -1;
						}
				}
			}

			function logInform() {
				var informBar = document.createElement('div');
				informBarStyle();
				contanerInformBar.appendChild(informBar);

				function informBarStyle() {
					informBar.style.height = ("120px");
					informBar.style.width = "180px";
					informBar.style.overflow = "auto";
					informBar.style.border = "solid 3px";
					informBar.style.borderRadius = "5px";
					informBar.style.borderColor = "#84c3be";
					informBar.style.display = "inline-block";
					informBar.style.verticalAlign = "top";
					informBar.style.backgroundColor = "#a7d4d1";
					informBar.style.textAlign = "center";
					informBar.style.margin = "0px 17px";
					informBar.style.title = "Свернуть лог боя";
					informBar.id = "informBar";
					informBar.innerHTML = "</br></br></br></br></br>";
					informBar.style.transition = "0.2s linear";
				}
			}

			function messagerAndSelectBar() {
				var messager = document.createElement('div');
				BarStyle(messager);
				contanerInformBar.appendChild(messager);
				messager.id = "messager";

				var selector = document.createElement('div');
				BarStyle(selector);
				selector.innerHTML = "<p> Атакуем ! </p>";
				selector.style.fontSize = "20px";
				selector.style.color = "#5a3d30";
				selector.id = "selector";
				contanerInformBar.appendChild(selector);

				function BarStyle(elem) {
					elem.style.height = ("80px");
					elem.style.width = "180px";
					elem.style.textAlign = "center";
					elem.style.borderColor = "#84c3be";
					elem.style.border = "solid 3px";
					elem.style.borderRadius = "5px";
					elem.style.borderColor = "#84c3be";
					elem.style.margin = "15px auto";
					elem.style.backgroundColor = "#a7d4d1";
					elem.innerHTML = ". . .";
				}
			}

		}
	}
}

function constructionFleetsAndBalanceOfPower() {
	fleetLeft = creationFleet(); // Флотилия 1
	fleetRight = creationFleet(); // Флотилия 2

	while (!balanceOfPower(fleetLeft, battleArrayLeft)) {}
	while (!balanceOfPower(fleetRight, battleArrayRight)) {}

	function balanceOfPower(fleet, arr) {
		var coorX, coorY, Horizontal;

		for (var oneShip in fleet.ships) {
			var cells = fleet.ships[oneShip].length;
			var check = checkPosition();
			var reboot = false;
			do {
				if (reboot) return false; // невозможно расставить корабли
				coorX = Math.floor(Math.random()*(battleWidth - cells + 1)) + 1;
				coorY = Math.floor(Math.random()*(battleHeight - cells + 1)) + 1;
				Horizontal = Math.round(Math.random());
			} while (!check())
			
			standePosition();
			environmentCheck();
		}
		return true; // Корабли расставлены

		function checkPosition() { // проверка выбраной случайно позиции
			var count = 0;
			return function check() { // поиск до 100-й итерации
						count++;
						if (count > 100) {
							count = 0;
							return count100();
						}
						return verification(arr, coorX, coorY, Horizontal);

						function count100() { // рандомный поиск не удался, перебор всех возможных положений
							if (searchCoor()) return true;
							Horizontal = 0 - (Horizontal - 1); // Смена вертикаль-горизонталь
							if (searchCoor()) return true;
							for (var height = 1; height <= battleHeight; height++) {
								for (var width = 1; width <= battleWidth; width++) {
					  				arr[height][width].ship = 0;
					  				arr[height][width].cell.className = "battleCell";
								}
							}
							reboot = true; // неудачная расстановка - поиск с начала
							return false;
							
							function searchCoor() { // последовательный поиск
								for (var height = 1; height <= battleHeight - cells + 1; height++) {
							    	for (var width = 1; width <= battleWidth - cells + 1; width++) {
								    	if (verification(arr, width, height, Horizontal)) {
								    		coorX = width;
								    		coorY = height;
								    		return true;
								    	}
									}
								}
								return false;
							}
						}
		}

		function verification(A, X, Y, H) { // занятость ячейки другим кораблем
			if (H) {
				for (var i = 0; i < cells; i++) {
					if (A[Y][X + i].ship) return false;
				}
			} else {
				for (var i = 0; i < cells; i++) {
					if (A[Y + i][X].ship) return false;
				}
			}
			return true;
			}
		}

		function standePosition() {
			if (Horizontal) {
				for (var i = 0; i < cells; i++) {
					arr[coorY][coorX + i].ship = fleet.ships[oneShip];
					arr[coorY][coorX + i].ship.arrCells.push(arr[coorY][coorX + i]);
					//arr[coorY][coorX + i].cell.className = "ships";
				}
			} else {
				for (var i = 0; i < cells; i++) {
					arr[coorY + i][coorX].ship = fleet.ships[oneShip];
					arr[coorY + i][coorX].ship.arrCells.push(arr[coorY + i][coorX]);
					//arr[coorY + i][coorX].cell.className = "ships";
				}
			}
		}

		function environmentCheck() {
			if (Horizontal) {
				for (var i = -1; i < cells + 1; i++) {
					cellNotNull(arr[coorY - 1][coorX + i]);
					cellNotNull(arr[coorY + 1][coorX + i]);
				}
				cellNotNull(arr[coorY][coorX - 1]);
				cellNotNull(arr[coorY][coorX + cells]);
			} else {
				for (var i = -1; i < cells + 1; i++) {
					cellNotNull(arr[coorY + i][coorX + 1]);
					cellNotNull(arr[coorY + i][coorX - 1]);
				}
				cellNotNull(arr[coorY - 1][coorX]);
				cellNotNull(arr[coorY + cells][coorX]);
		}

			function cellNotNull(cellCheck) {
				cellCheck.ship = 1;
				arr[coorY][coorX].ship.arrEnv.push(cellCheck);
			}
		}
	}

	function creationFleet() {
		var totalArea = battleWidth * battleHeight;
		var shipArea = Math.floor(totalArea / 5);
		var fleet = {count: {total: 0,}, ships: {}, loss: {total: 0,}};

		var shipMax = 1;

		construction:
		while (shipArea > 0) {
			for (var shipCell = 1; shipCell < shipMax; shipCell++) {
				fleet.count.total++;
				if (shipArea <= shipCell) {
					consructionShip(shipArea);
					break construction;
				};
				consructionShip(shipCell);
				shipArea -= shipCell;
			};
			shipMax++;
		}

		return fleet;

		function consructionShip(cells) {
			var ship = new Ship(cells, fleet);
			fleet.ships[fleet.count.total] = ship;
			if (fleet.count[ship.name]) {
				fleet.count[ship.name]++;
			} else {
				fleet.count[ship.name] = 1;
				fleet.loss[ship.name] = 0;
			}
		}
	}
	function Ship(length, fleet) {
		this.toString = function() {return "K";}
		this.length = length;
		this.fleet = fleet;
		this.arrCells = [];
		this.arrEnv = [];
		this.wholePart = length;
		this.message = "";
		this.name = (this.length == 1) ? "Корвет" :
					(this.length == 2) ? "Фрегат" :
					(this.length == 3) ? "Эсминец" :
					(this.length == 4) ? "Легкий крейсер" :
					(this.length == 5) ? "Тяжелый крейсер" :
					(this.length == 6) ? "Вертолетоносец" :
					(this.length == 7) ? "Авианосец" :
					(this.length == 8) ? "Дредноут" : "Супердредноут";

		this.hit = function(indexCell) {
			this.wholePart--;
			if (this.wholePart) {
				this.message = "Есть попадание!";
				indexCell.className = "ships shipsHit";
				indexCell.array.ship = 3;
				battleLog(indexCell, "...попал!");
				battleMessenger(this.message, "#ff9baa");
				playSound("bang", (Math.floor(Math.random() * 4)));
				coordComputer(1, indexCell);

			} else {
				this.message = this.name + " уничтожен!";
				indexCell.array.ship = 4;
				battleLog(indexCell, "- уничтожил!");
				battleMessenger(this.message, "#ff6b81");
				playSound("bang", 4);
				this.fleet.loss.total++;
				this.fleet.loss[this.name]++;
				closeHitBattleAndCell(this);
				coordComputer(0, indexCell);
			}
		};

		function coordComputer(notDestroyed, self) {
			checkHumanAndChangeParametrsTarget(playerTwo, battleArrayLeft);
			checkHumanAndChangeParametrsTarget(playerOne, battleArrayRight);

			function checkHumanAndChangeParametrsTarget(player, array) {
				
				if (!player.human && (self.player == array)) {
					
					if (!player.computer.target.hit && !player.computer.target.hitAgain) {

						player.computer.target.Horizontal = Math.round(Math.random());
						player.computer.target.direction = Math.round(Math.random()) ? 1 : -1;
					}
					player.computer.target.hit = notDestroyed;
					player.computer.target.hitAgain = notDestroyed;

					if (!notDestroyed) {
						changeAfterDestroyed(player.computer.target)
					}
				}
				function changeAfterDestroyed(target) {
					target.changeHorizont = 0;
					target.changeDirection = 0;
				}
			}
		}

		function closeHitBattleAndCell(self) {
			for (var cell = 0; cell < self.arrCells.length; cell++) {
				self.arrCells[cell].cell.className = "ships shipsDestroyed";
			}
			for (var env = 0; env < self.arrEnv.length; env++) {
				if (self.arrEnv[env].cell) {
					self.arrEnv[env].cell.className = "battleCellHit";
					self.arrEnv[env].ship = 2;
				}
			}
		}
	}
}

function battleFieldConstruction() {
	var sea = document.getElementById('battle');
	sea.style.width = ((battleWidth + 1) * 2 * SIZE_CELL + 220 + "px");
	sea.style.minWidth = (SIZE_CELL * 21 + "px");
	sea.style.position = "relative";

	var squareLeft = document.createElement('div');
	creationSquare(squareLeft, battleArrayLeft);
	squareLeft.style.transition = "0.3s linear";
	squareLeft.id = "squareLeft";
	sea.appendChild(squareLeft);

	var squareRight = document.createElement('div');
	creationSquare(squareRight, battleArrayRight);
	squareRight.style.transition = "0.3s linear";
	squareRight.id = "squareRight";
	sea.appendChild(squareRight);
	squareRight.style.position = "absolute";
	squareRight.style.right = "5px";
	
	function creationSquare(square, battleArray) {
		allStyle(square, 1, 1, "#84c3be", 0);
		battlebarTopLeft();

		var arrayTop = [];
		var arrayLeft = [];
		creatArr (arrayTop, battleWidth, 1040);
		creatArr (arrayLeft, battleHeight, 1);

		battleBarTop();
		battleBarLeft();

		battleBarCenter();

		function battlebarTopLeft() {
			var barTopLeft = document.createElement('div');
			allStyle(barTopLeft, 1 - battleWidth, 1 - battleHeight, 
					"#84c3be", 2);
			barTopLeft.innerHTML = "<span class='battlebar'>Код</span>";
			barTopLeft.style.textAlign = "center";
			barTopLeft.style.verticalAlign = "top";
			square.appendChild(barTopLeft);
		}

		function battleBarTop() {
			var barTop = document.createElement('div');
			allStyle(barTop, 0, 1 - battleHeight, "#84c3be", 0);
			square.appendChild(barTop);
			designation(barTop, arrayTop);
		}

		function battleBarLeft() {
			var barLeft = document.createElement('div');
			allStyle(barLeft, 1 - battleWidth, 0, "#84c3be", 0);
			barLeft.style.verticalAlign = "top";
			square.appendChild(barLeft);
			designation(barLeft, arrayLeft);
		}

		function creatArr(arr, len, elem) {
			arr[0] = 0;
			if (elem < 1000) {
				for (var i = 1; i < len + 1; i++) {
					arr[i] = elem++;
				}
			} else {
				for (var i = 1; i < len + 1; i++) {
					arr[i] = String.fromCharCode(elem++);
				}
			}
		}

		function battleBarCenter() {
			var barCenter = document.createElement('div');
			allStyle(barCenter, 0, 0, "inherit", 0);
			barCenter.style.cursor = "crosshair";
			square.appendChild(barCenter);
			battleFieldArray();

			function battleFieldArray() {
				for (var height = 0; height <= battleHeight + 1; height++) {
				    var battleArrayWidth = [];
					for (var width = 0; width <= battleWidth + 1; width++) {
			      		battleArrayWidth[width] = {ship: 0, cell: null};
					}
				    battleArray[height] = battleArrayWidth;
				}
				for (height = 1; height <= battleHeight; height++) {
			    	for (width = 1; width <= battleWidth; width++) {
			      		battleArray[height][width].cell =
			      		battleCell(battleArray[height][width], width, height);
					}
				}
			}

			function battleCell(arrayCell, W, H) {
				var cell = document.createElement('div');
				cell.className = "battleCell";
				cell.style.width = (SIZE_CELL - PAD_MAR * 4 + "px");
				cell.style.height = (SIZE_CELL - PAD_MAR * 4 + "px");
				cell.style.verticalAlign = "top";
				if (((playerOne.human == 1) && (playerTwo.array == battleArray)) || 
					((playerTwo.human == 1) && (playerOne.array == battleArray))) {
					cell.onclick = fire; 
				}
				barCenter.appendChild(cell);
				cell.array = arrayCell;
				cell.player = battleArray;
				if (battleArray == battleArrayLeft) {
					cell.addres = "< " + arrayTop[W] + " " + "-" + " " + arrayLeft[H];
				} else {
					cell.addres = arrayTop[W] + " " + "-" + " " + arrayLeft[H] + " >";
				}
				return cell;
			}

		}

		function designation(bar, arr) {
			for (var i = 1; i < arr.length; i++) {
				var elem = document.createElement('div');
				allStyle(elem, 1 - battleWidth, 1 - battleHeight, 
						"#c8e3e1", PAD_MAR);
				elem.style.textAlign = "center";
				elem.style.fontSize = ((SIZE_CELL - PAD_MAR *4) / 2 + "px");
				elem.innerHTML = ("<span class='battlebar'>" +arr[i]
									+ "</span>");
				bar.appendChild(elem);
			}
		}
	}
	function allStyle(element, corW, corH, color, corC) {
		element.style.width = (((battleWidth + corW) * SIZE_CELL - 
								corC * 4) + "px");
		element.style.height = (((battleHeight + corH) * SIZE_CELL - 
								corC * 4) + "px");
		element.style.margin = (corC + "px");
	 	element.style.padding = (corC + "px");
	 	element.style.backgroundColor = color;
	 	element.style.display = "inline-block";
	}
}

function battleLog(cell, message) {
	var log = document.getElementById('informBar');
	log.innerHTML += "</br>" + cell.addres + " " + message;
	log.scrollTop += 100;
}

function battleMessenger(message, color) {
	var messager = document.getElementById('messager');
	messager.style.backgroundColor = color;
	messager.innerHTML = message;
}

function playSound(file, number) {
	var audio = new Audio();
	audio.volume = 0.01;
	audio.src = ("audio/" + file + "/audio" + number + ".mp3");
	audio.play();
}

function fire() {
	var cell = this;
	if (stopGame) controlJudge;
	if (controlPlayers()) {
		processingFire(this);
		controlJudge();

	} else if (!stopGame) {
			battleMessenger("Ход другого игрока", "#ff8800");
			playSound("no", 0);
		}

	function controlPlayers() {
		if (((cell.player == battleArrayLeft) && (rotationPlayers == 2)) ||
			((cell.player == battleArrayRight) && (rotationPlayers == 1)) ) {
			return true;
		}
		return false;
	}

	function processingFire(cell) {
		if (cell.array.ship == 0 || cell.array.ship == 1) {
			cell.array.ship = 2;
			cell.className = "battleCellHit";
			battleLog(cell, "...мимо...");
			battleMessenger(". . .", "#a7d4d1");
			playSound("plop", (Math.floor(Math.random() * 3) + 1));
			if (rotationPlayers == 1) {
				rotationPlayers = 2;
				if (playerOne.human == 0) {
					playerOne.computer.target.hitAgain = 0;
				}
			}
			else {
				rotationPlayers = 1;
				if (playerTwo.human == 0) {
					playerTwo.computer.target.hitAgain = 0;
				}
			}


		} else if (cell.array.ship == 2) {
			// do nothing;
		} else {
			cell.array.ship.hit(cell);
		}
	}

	function controlJudge() {

		scoreL();

		if (judge.fleets.left.count.total == judge.fleets.left.loss.total) {
			finish(playerTwo);
			return;
		}
		if (judge.fleets.right.count.total == judge.fleets.right.loss.total) {
			finish(playerOne);
			return;
		}
		if (stopGame) {
			if (judge.fleets.left.loss.total == judge.fleets.right.loss.total) {
				finish("Мир!");
			}
			if (judge.fleets.left.loss.total > judge.fleets.right.loss.total) {
				finish(playerTwo);
			}
			if (judge.fleets.left.loss.total < judge.fleets.right.loss.total) {
				finish(playerOne);
			}
			return;
		}  

		rotationSelect();
		setTimeout(processGame, 500);

		function scoreL() {
			var listingLoss = document.getElementById("leftLoss");
			scoreLoss(judge.fleets.left.loss);
			listingLoss = document.getElementById("rightLoss");
			scoreLoss(judge.fleets.right.loss);

			function scoreLoss(fleet) {
				var num = 2;
				for (var key in fleet) {
					if ( key == "total") {
						listingLoss.children[1].innerHTML = ("Общее количество: " + 
												fleet[key] + " ед.");
					} else {listingLoss.children[num].innerHTML = ("" + key + ": " + 
												fleet[key] + " ед.");
					num++;
					}
				}
			}
		}

		function finish(player) {
			var nameWin;
			if (typeof player == "string") {
				nameWin = player;
			} else {
				if (player.human == 0 && player.otherPlayer.human == 0) {
					nameWin = player.computer.name;
				} else {
					nameWin = player.name;
				}
			}
			
			battleMessenger("Победил: " + nameWin, "#fd7c6e");
			rotationPlayers = 0;
			stopGame = 1;

			var selector = document.getElementById("selector");
			selector.style.background = "none #a7d4d1";
			selector.innerHTML = "Игра окончена!";

			var square = document.getElementById("squareLeft");
			square.style.boxShadow = "none";
			square = document.getElementById("squareRight");
			square.style.boxShadow = "none";
		}
	}
}

function artificialIntellingence() {

	var arr;
	var player;
	if (rotationPlayers == 1) {
		arr = battleArrayRight;
		player = playerOne.computer.target;
	} else {
		arr = battleArrayLeft;
		player = playerTwo.computer.target;
	}
	var height = arr.length;
	var width = arr[0].length;
	var coorX = player.coorX, coorY = player.coorY;

	selectTarget();

	attack();

	function selectTarget() {
		if (player.hit == 0) {
			selectCoor();
			player.coorYnext = player.coorY = coorY;
			player.coorXnext = player.coorX = coorX;
		} else {
			while(!rememberTarget()){};
			coorY = player.coorYnext;
			coorX = player.coorXnext;
			player.changePossible = 1;
		}

		function rememberTarget() {

			if (player.hitAgain) {
				return checkCoordinates();
			} else {
				player.coorYnext = player.coorY;
				player.coorXnext = player.coorX;
				if (player.changePossible) changeHorizontDirection();
				return checkCoordinates();
			}

			function checkCoordinates() {
				if (player.Horizontal) {
					player.coorXnext += player.direction;
					if ((player.coorXnext < width - 1) && (player.coorXnext > 0) &&
						(arr[player.coorYnext][player.coorXnext].ship != 2)) {
						return true;
					}
					changeHorizontDirection();
					return false;

				} else {
					player.coorYnext += player.direction;
					if ((player.coorYnext < height - 1) && (player.coorYnext > 0) &&
						(arr[player.coorYnext][player.coorXnext].ship != 2)) {
						return true;
					}
					changeHorizontDirection();
					return false;
				}
			}

			function changeHorizontDirection() {
				player.changePossible = 0;
				if (!player.changeDirection) {
					player.changeDirection = 1;
					player.direction = -player.direction;
					player.coorYnext = player.coorY;
					player.coorXnext = player.coorX;
				} else {
					player.changeHorizont = 1;
					player.changeDirection = 0;
					player.Horizontal = -(player.Horizontal - 1);
					player.coorYnext = player.coorY;
					player.coorXnext = player.coorX;
				}
			}

		}
	}

	function attack() {
		var cell = arr[coorY][coorX].cell;
		fire.call(cell);
	}

	function selectCoor() {
		var check = checkPosition();
		do {
			coorX = Math.floor(Math.random()*(width -2)) + 1;
			coorY = Math.floor(Math.random()*(height - 2)) + 1;
		} while (!check())
		
		function checkPosition() { // проверка выбраной случайно позиции
			var count = 0;
			return function check() { // поиск до 1000-й итерации
						count++;
						if (count > 1000) {
							count = 0;
							return count100();
						}
						return verification(arr, coorX, coorY);

						function count100() { // рандомный поиск не удался, перебор всех возможных положений
							if (searchCoor()) return true;
							alert("Oooops");						
							function searchCoor() { // последовательный поиск
								for (var h = 1; h <= height; height++) {
							    	for (var w = 1; w <= width; width++) {
								    	if (verification(arr, w, h)) {
								    		coorX = w;
								    		coorY = h;
								    		return true;
								    	}
									}
								}
							}
						}
					}
		}
	}

	function verification(A, X, Y) { // занятость ячейки другим кораблем
		if ((A[Y][X].ship == 2) || (A[Y][X].ship == 3) || (A[Y][X].ship == 4)) {
			return false;
		}
		return true;
	}
}




