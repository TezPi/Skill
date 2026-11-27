/*
 * demo_depth_soul.jsx - run from File > Scripts > Run Script File.
 * Loads sft_depth_soul.jsx from the same folder and builds "SFT Depth Soul Demo"
 * in a new composition inside one undo group. Nothing existing is modified.
 */
(function () {
    var lib = new File(new File($.fileName).parent.fsName + "/sft_depth_soul.jsx");
    var res;
    if (!lib.exists) {
        alert("sft_depth_soul.jsx must sit next to this file.");
        return;
    }
    $.evalFile(lib);
    res = $.global.SFT_DS.run("SFT Depth Soul Demo", function () {
        return $.global.SFT_DS.demo();
    });
    if (res.ok) {
        alert("Built '" + res.result.comp + "'. Stagger offsets (frames): " + res.result.staggerFrames.join(", "));
    } else {
        alert("SFT Depth Soul Demo stopped: " + res.error + "\nUndo once to remove the partial build.");
    }
}());
