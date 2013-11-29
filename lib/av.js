/*jslint sloppy: true, vars: true, white: false, browser: true */
var av = {
    player_url: 'av.swf',
    player_settings: {
        'allowScriptAccess': 'sameDomain',
        'allowFullScreen': 'true',
        'scale': 'noscale',
        'salign': 'tl',
        'wmode': 'gpu',
        'bgcolor': '#ffffff'
    },
    supports_video: function () {
        return !!document.createElement('video').canPlayType;
    },
    supports_h264_baseline_video: function () {
        if (!this.supports_video()) {
            return false;
        }
        var v = document.createElement("video");
        return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    },
    supports_audio: function () {
        return !!document.createElement('audio').canPlayType;
    },
    supports_mp3: function () {
        if (!this.supports_audio()) {
            return false;
        }
        var a = document.createElement('audio');
        return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
    },
    flash_embed: function (w, h, src) {
        var f = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
        var e = '';
        var prop;
        f += 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ';
        f += 'width="' + w + '" height="' + h + '">';
        for (prop in this.player_settings) {
            if (typeof this.player_settings[prop] !== 'function') {
                var val = this.player_settings[prop];
                f += '<param name="' + prop + '" value="' + val + '" />';
                e += ' ' + prop + '="' + val + '"';
            }
        }
        f += '<param name="movie" value="' + this.player_url + '?media_url=' + src + '" />';
        f += '<embed width="' + w + '" height="' + h + '" src="' + this.player_url + '?media_url=' + src + '"';
        f += e + 'type="application/futuresplash" /></object>';
        return f;
    },
    replace_html5_media_tags: function () {
        $('video').replaceWith(function () {
            var src = $(this).attr('src');
            var w = $(this).attr('width');
            var h = $(this).attr('height');
            return av.flash_embed(w, h, src);
        });
        $('audio').replaceWith(function () {
            var src = $(this).attr('src');
            var w = 256;
            var h = 24;
            return av.flash_embed(w, h, src);
        });
    }
};
$(function () {
    if (!av.supports_h264_baseline_video() || !av.supports_mp3()) {
        av.replace_html5_media_tags();
    }
});