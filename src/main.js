// load JQuery if necessary
if(!($ = window.jQuery)) {
    var script = document.createElement("script");
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js";
    script.onload = main;
    document.body.appendChild(script);
} else {
    main();
}

function main() {
    if(/^portal.mycampus.ca/.exec(window.location.host)) {
        forwardHref();
        return;
    }

    if($(".mycampus-marker").size() > 0) {
        $(".mycampus-marker").fadeIn();
    } else {
        var o = injectUI();
        o.button.on('click', function() {
            var text = o.text.val();
            updateForm(text, o);
        });
    }
}

function forwardHref() {
    var frames = document.getElementsByTagName("frame");
    if(frames.length >= 2) window.location.href = frames[1].src;
}

function injectUI() {
    var outer = $("<div>").css({
            position: "fixed",
            width: "500px",
            height: "100%",
            padding: "20px",
            top: 0,
            right: 0,
            background: '#aaa',
            'font-family': '"Courier New"',
        })
        .addClass("mycampus-marker")
        .appendTo($('body'));

    var tools = $('<div>').css({
        'text-align': 'right',
        width: '100%',
    })
    .appendTo(outer)
    .append("<span>Please enter your grades in below.</span>");

    var button = $('<button>Update Form</button>').css({
        'font-family': "Courier New",
        'font-size': '9pt',
        'font-weight': 'bold',
        'border': 'none',
        'border-radius': '3px',
        'background': '#fff',
        'padding': '5px',
        'margint-left': '10px',
    }).appendTo(tools);

    var div = $("<div>").css({
        padding: '20px',
    }).appendTo(outer);

    var textbox = $("<textarea>").css({
        background: '#ddd',
        width: '100%',
        height: '500px',
        'font-size': '12pt',
    }).appendTo(div);

    var message = $("<pre>").appendTo(outer);

    return {
        button: button,
        text: textbox,
        message: message,
        outer: outer,
    }
}

function updateForm(text, o) {
    // parse the text
    var entries = {};
    text.split("\n").forEach(function(line) {
        line = line.trim();
        if(line.length > 0) {
            var entry = parseLine(line);
            if(entry != null) {
                entries[entry.banner] = entry.grade;
            }
        }
    });
    window.grades = entries;

    o.outer.fadeOut();

    // upgrade the form
    var tdlist = $("td").filter(function(i, x) {
        return /^100/.exec($(x).text());
    });

    tdlist.each(function(i, td) {
        if(i % 2 == 0) {
            var banner = $(td).text();
            var grade = entries[banner];
            if(grade) {
                var select = $(td).parent().find("select[name=grde_tab]");
                select.val(grade);
            } else {
                console.error("IGNORED BANNER", banner, "has no grade.");
            }
        }
    });
}

function injectEntry(e) {
    console.debug("Injecting", e);
}

function parseLine(line) {
    var m1 = /\b(100\d\d\d\d\d\d)\b/.exec(line);
    // var m2 = /\b(A\+|A|A-|B\+|B|B-|C\+|C|D|F)$/.exec(line);
    var m2 = /\b(\d\d)$/.exec(line);

    if(m1 == null) {
        console.error("IGNORED missing banner ID", line);
        return null;
    }
    if(m2 == null) {
        console.error("IGNORED missing grade", line);
        return null;
    }
    var banner = m1[1],
        mark = parseInt(m2[1]),
        grade = letterGrade(mark);

    console.info(banner, mark, grade);

    return {
        banner: banner,
        grade: grade,
    }
}

function letterGrade(x) {
    if(x >= 90) return "A+";
    if(x >= 85) return "A";
    if(x >= 80) return "A-";
    if(x >= 77) return "B+";
    if(x >= 73) return "B";
    if(x >= 70) return "B-";
    if(x >= 67) return "C+";
    if(x >= 60) return "C";
    if(x >= 50) return "D";
    else return "F";
}
