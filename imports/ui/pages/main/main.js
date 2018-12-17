import { Meteor } from 'meteor/meteor';
import './main.html';

Template.main.onCreated(function () {
    //
});

const VIEWPORT_WIDTH = 16;
const VIEWPORT_HEIGHT = 9;

var tiles = [];
for (var i = 0; i < VIEWPORT_HEIGHT; i++) {
    tiles[i] = [];
    for (var j = 0; j < VIEWPORT_WIDTH; j++) {
        tiles[i][j] = [16,16];
    }
}

Template.main.helpers({
    gridRows() {
        return [...Array(9).keys()];
    },
    gridCols() {
        return [...Array(16).keys()];
    },
    thisTile(row, col) {
        return "c"+tiles[row][col][0]+"r"+tiles[row][col][1];
    }
});

var d = [];
var w = 352;
var x = 2;
const KEY_LEFT = 37, KEY_RIGHT = 39, KEY_UP = 38, KEY_DOWN = 40;
const WALK_FRAMES = 4;
const TILE_SIZE = 32;
var walkPos = 0;
var walkPosFrames = [0, -(TILE_SIZE), -(TILE_SIZE*2), -(TILE_SIZE), -(TILE_SIZE*3)];
var toonOffsetX = -288;
var toonOffsetY = -128;

function newv(v,a,b, distance) {
    if (d[a] || d[b]) {
        var max = 0;
        if (KEY_LEFT === a) {
            max = (VIEWPORT_WIDTH-1) * TILE_SIZE;
        } else {
            max = (VIEWPORT_HEIGHT-1) * TILE_SIZE;
        }
        //console.log('[[[[]]]]',distance, max);
        var n = parseFloat(v, 10) - (d[a] ? distance : 0) + (d[b] ? distance : 0);
        //console.log('(', v, parseFloat(v, 10), n, ')');
        return n < 0 ? 0 : n > max ? max : n;
    } else {
        return v;
    }
}

Meteor.setInterval(function() {
    var distance = x;
    if (d[KEY_LEFT] || d[KEY_RIGHT]) {
        if (d[KEY_UP] || d[KEY_DOWN]) {
            distance = Math.sqrt((x*x)/2);
        }
    }
    $('#character').css({
        left: function(i,v) { return newv(v, KEY_LEFT, KEY_RIGHT, distance); },
        top: function(i,v) { return newv(v, KEY_UP, KEY_DOWN, distance); }
    });
}, 25);

Meteor.setInterval(function() {
    $('#character .character-sprite').css({
        'background-position-x': function(i,v) {
            walkPos = (walkPos+1) % WALK_FRAMES;
            return walkPosFrames[walkPos]+toonOffsetX;
        }
    });
},300);

$(window).on('keydown', function(event, instance) {
    //console.log('down', event.which)
    d[event.which] = true;
    switch (event.which) {
    case KEY_LEFT:
        $('#character .character-sprite').removeClass("north south east").addClass("west");
        break;
    case KEY_RIGHT:
        $('#character .character-sprite').removeClass("north south west").addClass("east");
        break;
    case KEY_UP:
        $('#character .character-sprite').removeClass("south east west").addClass("north");
        break;
    case KEY_DOWN:
        $('#character .character-sprite').removeClass("north east west").addClass("south");
        break;
    }
});
$(window).on('keyup', function(event, instance) {
    console.log('up', event.which)
    d[event.which] = false;

    d.forEach(function(elem, key) {
        if (true === elem) {
            switch (key) {
            case KEY_LEFT:
                $('#character .character-sprite').removeClass("north south east").addClass("west");
                break;
            case KEY_RIGHT:
                $('#character .character-sprite').removeClass("north south west").addClass("east");
                break;
            case KEY_UP:
                $('#character .character-sprite').removeClass("south east west").addClass("north");
                break;
            case KEY_DOWN:
                $('#character .character-sprite').removeClass("north east west").addClass("south");
                break;
            }
            return;
        }
    });
});
