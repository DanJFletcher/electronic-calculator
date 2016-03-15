/* NOTE:
 * '%' button is not yet implemented.
 * All other buttons function properly, (Except 'CE') and you can 
 * create long expressions such as, 5 * 5 - 5 / 4 + 2.5 \ 100 = 23.775
 * You can even continue pressing the "equals" button (=) after an evaluation
 * and the expression will be the last operand and operator on the current
 * value of the register.
 * Example: 5 + 2 yields "7".
 * Pressing equals will give the result: 9, then 11, 13 etc.
 *
 * The calculator also allows expression chaining, i.e.
 * Use the value contained in the display, as the first operand in the next 
 * expression, if an operator is the first input, after an evaluation
 * (when the "equals" button is pressed).
 * 
 * No large numbers yet.
 * Any number with more than 11 digits will cause an "Error" - which will
 * be reflected in the display.
 */

// globals
var expression = []; // expression to evaluate when equals pressed
var display = "";    // the output displayed to user
var operator;        // last operator pressed
var operatorPressed = false; // flag raised when operator is prev pressed button
var equalsPressed = false;   // flag raised when requals is prev pressed button
var register = "";           // the prev value of the display
var btn;

$("document").ready(function() {
  
  // update cursor when mousing
  // over buttons.
  $(".button").hover(function() {
    $("body").css("cursor", "pointer");
  });

  $(".button").mouseleave(function() {
    $("body").css("cursor", "default");
  });

  // what happens when a button is clicked?
  $(".button").click(function() {
    btn = $(this).attr("id");
    switch (btn) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        // if prev button was an operator
        // then clear the current display,
        // and append the value of btn
        // to it.
        if (operatorPressed) {
          equalsPressed = false;
          // the regester keeps track
          // of this operator, so we can
          // continue pressing equals and use
          // the most recent operator.
          // i.e. 1+1=2=3=4=5...and so on.
          register = btn;
          display = btn;
          operatorPressed = false; // lower the flag.
          updateDisplay();
          // if equals was the last button
          // pressed, then we are starting a new
          // expression, and it should be cleared.
        } else if (equalsPressed) {
          expression = [];
          display = btn;
          equalsPressed = false;
          updateDisplay();
          // otherwise, just concat the 
          // btn value to the display.
        } else {
          display += btn;
          updateDisplay();
        }
        break;
      case "point":
        display += "."; // add a decemial to the display.
        updateDisplay();
        break;
      case "plus":
        pushOperator("+");
        break;
      case "minus":
        pushOperator("-");
        break;
      case "multiply":
        pushOperator("*");
        break;
      case "divide":
        pushOperator("/");
        break;
      case "equals":
        // if equals is the last button pressed,
        // then the regester shouldn't change.
        // otherwise set the regester to the current display.
        register = !equalsPressed ? parseFloat(display) : register;
        expression.push(register);
        display = calculate(expression).toString();
        equalsPressed = true; // raise the flag!
        // set the last operator pressed to the expression.
        // if equals is pressed again, then this operator will
        // be used on the regester and the displayed value.
        expression.push(operator); 
        updateDisplay();
        break;
      case "CE":
        display = display.toString().slice(0, -1);
        updateDisplay();
    }

    // click animation (push in)
    $(this).css({
      "border-style": "inset",
      "background": "linear-gradient(#3B3744, #888)"
    });
    // click animation (pop out)
    setTimeout(function() {
      $("#" + btn).css({
        "border-style": "outset",
        "background": "linear-gradient(#888, #3B3744)"
      });
    }, 100);
  }); // end click function

  /**
   * pushes the current display,
   * and selected operator to the expression
   * @param op operator as String
   */
  var pushOperator = function(op) {
    operator = op;
    // if equals was the last input,
    // then we need to clear the expression,
    // and start a new one.
    if (equalsPressed) expression = [];
    expression.push(parseFloat(display));
    expression.push(op);
    operatorPressed = true;
  };

  /**
   * reset all memory, and update
   * the display.
   */
  $("#AC").click(function() {
    expression = [];
    display = "";
    register = "";
    operator = "";
    operatorPressed = false;
    equalsPressed = false;
    updateDisplay();

    // click animation
    $(this).css({
      "border-style": "inset",
      "background": "linear-gradient(#C70039, #D71049)"
    });

    setTimeout(function() {
      $("#" + btn).css({
        "border-style": "outset",
        "background": "linear-gradient(#D71049, #C70039)"
      });
    }, 100);
  })

});

/**
 * Set the screen to display the value of "display".
 */
var updateDisplay = function() {
  if (display) {
    if (display.length > 11) {
      $("#display-text").text("Error");
    } else {
      $("#display-text").text(display);
    }
  } else {
    $("#display-text").text("0");
  }
};

/**
 * Calculates the expression,
 * given as an Array of operators and
 * numbers.
 * @param exp 
 */
var calculate = function(exp) {

  // starting with division and multiplication,
  // find each operator and evaluate the expression.
  while (exp.length > 1) {
    console.log(exp);
    for (var i = 0; i < exp.length; i++) {
      if (exp[i + 1] === "*") {
        // evalute the expression,
        // and overwirte the value of contained
        // in the left of the operator.
        // Then remove the operator and the preceding
        // value from the expression.
        exp[i] = exp[i] * exp[i + 2];
        exp.splice(i + 1, 2);
      } else if (exp[i + 1] === "/") {
        exp[i] = exp[i] / exp[i + 2];
        exp.splice(i + 1, 2);
      }
    }

    for (var i = 0; i < exp.length; i++) {
      if (exp[i + 1] === "+") {
        exp[i] = exp[i] + exp[i + 2];
        exp.splice(i + 1, 2);
      } else if (exp[i + 1] === "-") {
        exp[i] = exp[i] - exp[i + 2];
        exp.splice(i + 1, 2);
      }
    }
  }
  return exp[0]; // exp[0] is the result.
};