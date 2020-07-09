/**
 * ====================================
 * 
 * VARIABLES :
 * 
 * ====================================
*/

var canvas
var ctx
var brush = {
    x: 0,
    y: 0,
    color: '#000000',
    size: 10,
    down: false,
}
var strokes = []
var currentStroke = null

var gomme = false
var ligne = false
var rectangleV = false
var rectangleR = false
var cercleV = false
var cercleR = false
var pencil = true


/**
 * =======================
 * 
 * FUNCTIONS :
 * 
 * ====================================
*/

function redraw() {
    ctx.clearRect(0, 0, canvas.width(), canvas.height())
    ctx.lineCap = "round"

    for (var i = 0; i < strokes.length; i++) {

        var s = strokes[i]

        ctx.strokeStyle = s.color
        ctx.lineWidth = s.size

        ctx.beginPath()
        ctx.moveTo(s.points[0].x, s.points[0].y)

        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j]

            ctx.lineTo(p.x, p.y)
        }
        ctx.stroke();
    }
}

function redrawRect() {
    ctx.clearRect(0, 0, canvas.width(), canvas.height())

    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i]
        ctx.strokeStyle = s.color
        ctx.lineWidth = s.size
        ctx.fillStyle = s.color

        ctx.beginPath()

        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j]


            if (rectangleV)
                ctx.clearRect(s.points[0].x, s.points[0].y, p.x, p.y)

            if (rectangleR)
                ctx.fillRect(s.points[0].x, s.points[0].y, p.y, p.x)

        }
        if (rectangleV)
            ctx.strokeRect(s.points[0].x, s.points[0].y, p.x, p.y)
    }
}

function redrawCercle() {
    ctx.clearRect(0, 0, canvas.width(), canvas.height())

    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i]
        ctx.strokeStyle = s.color
        ctx.lineWidth = s.size
        ctx.fillStyle = s.color

        ctx.beginPath()

        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j]

            ctx.arc(p.x, p.y, s.points[0].x, s.points[0].y, Math.PI * 2, true)
        }
        if (cercleV) {
            ctx.stroke()
        }
        if (cercleR) {
            ctx.fill()
        }
    }
}

function init() {

    // stocker le canvas :
    canvas = $('#canvas')

    // stocker la largeur et hauteur :
    canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    // retourner un contexte de dessin sur le canevas :
    ctx = canvas[0].getContext('2d')

    function mouseEvent(e) {

        // définir largeur et hauteur :
        brush.x = e.pageX
        brush.y = e.pageY

        // ajouter les coordonées dans l'array 'points' créé :
        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        })

        if (pencil || gomme || ligne) {
            redraw()
        }

        if (rectangleV || rectangleR) {
            redrawRect()
        }

        if (cercleV || cercleR) {
            redrawCercle()
        }
    }

    canvas.mousedown(function (e) {

        brush.down = true

        // définir les couleur, taille et l'array points :
        currentStroke = {
            color: brush.color,
            size: brush.size,
            points: []
        }

        // ajouter dans strokes les valeurs définies :
        strokes.push(currentStroke)

        mouseEvent(e)
    }).mouseup(function (e) {
        brush.down = false

        mouseEvent(e)

        currentStroke = null
    }).mousemove(function (e) {
        if (!ligne) {
            if (brush.down) {
                mouseEvent(e)
            }
        }
    })


    /**
     * ------------------
     * Options:
     * ------------------
     */

    $('#save').click(function () {
        var data = canvas[0].toDataURL('image/png', 1.0)
        data = data.split(',')
        window.location.href = 'data:application/octet-stream;base64,' + data[1]
    })

    $('#clear').click(function () {
        if (confirm('Vous êtes sûr de vouloir tout effacer?')) {
            strokes = []
            redraw()
        }
    })

    $('#undo').click(function () {
        strokes.pop()
        redraw()
    })

    $('#toolColor').on('input', function () {
        if (gomme == false)
            brush.color = this.value
    })

    $('#toolSize').on('input', function () {
        brush.size = this.value
    })

    $('#toolGomme').click(function () {
        gomme = true
        pencil = false
        ligne = false
        rectangle = false
        cercle = false
        rectangleV = false
        rectangleR = false
        cercleR = false
        cercleV = false
        console.log('gomme : ' + gomme)

        if (gomme == true) {
            brush.color = 'white'
        }
    })

    $('#toolPencil').click(function () {
        pencil = true
        gomme = false
        ligne = false
        rectangle = false
        cercle = false
        rectangleV = false
        rectangleR = false
        cercleR = false
        cercleV = false
        console.log('pencil : ' + pencil)
    })

    $('#toolLine').click(function () {
        ligne = true
        gomme = false
        rectangle = false
        cercle = false
        pencil = false
        rectangleV = false
        rectangleR = false
        cercleR = false
        cercleV = false
        console.log('ligne : ' + ligne)
    })

    $('#toolRectangleVide').click(function () {
        rectangleV = true
        rectangleR = false
        gomme = false
        ligne = false
        cercle = false
        pencil = false
        cercleR = false
        cercleV = false
        console.log('rectangle vide : ' + rectangleV)
    })

    $('#toolRectangleRempli').click(function () {
        rectangleR = true
        rectangleV = false
        gomme = false
        ligne = false
        cercle = false
        pencil = false
        cercleR = false
        cercleV = false
        console.log('rectangle rempli : ' + rectangleR)
    })

    $('#toolCircleVide').click(function () {
        cercleV = true
        cercleR = false
        gomme = false
        ligne = false
        rectangle = false
        pencil = false
        rectangleV = false
        rectangleR = false
        console.log('cercle vide : ' + cercleV)
    })

    $('#toolCircleRempli').click(function () {
        cercleR = true
        cercleV = false
        gomme = false
        ligne = false
        rectangle = false
        pencil = false
        rectangleV = false
        rectangleR = false
        console.log('cercle rempli : ' + cercleR)

    })
}

$(init)