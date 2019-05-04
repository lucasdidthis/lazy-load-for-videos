import { init, resizeResponsiveVideos, videoratio } from '../shared/video';

/*
 * Lazy Load Youtube
 * by Kevin Weber (www.kweber.com)
 */

const $ = window.jQuery || window.$;

// Classes
const classPreviewYoutube = 'preview-youtube';
const classPreviewYoutubeDot = `.${classPreviewYoutube}`;
const classNotLoaded = 'js-lazyload--not-loaded';

// Helpers
let thumbnailurl = '';

let pluginOptions;
const defaultPluginOptions = {
  theme: 'dark', // possible: dark, light
  colour: 'red', // possible: red, white
  controls: true,
  loadpolicy: true,
  modestbranding: false,
  showinfo: true,
  relations: true,
  buttonstyle: '',
  preroll: '',
  postroll: '',
  videoseo: false,
  responsive: true,
  thumbnailquality: '0',
  loadthumbnail: true,
  callback: null,
};

function markInitialized() {
  $(classPreviewYoutubeDot).parent().removeClass(classNotLoaded);
}

function removePlayerControls(element) {
  $(element).removeClass(classPreviewYoutube);
}

function getVideoUrl(preroll, videoId, emu, embedstart) {
  let theme = '';
  let colour = '';
  let postroll = '';
  let playlist = '';
  let overridePreroll = preroll;

  /*
   * Configure URL parameters
   */
  if (pluginOptions.theme !== undefined && pluginOptions.theme !== theme && pluginOptions.theme !== 'dark') {
    theme = `&theme=${pluginOptions.theme}`;
  }
  if (pluginOptions.colour !== undefined && pluginOptions.colour !== colour && pluginOptions.colour !== 'red') {
    colour = `&color=${pluginOptions.colour}`;
  }

  const showinfo = pluginOptions.showinfo ? '' : '&showinfo=0';
  const relations = pluginOptions.relations ? '' : '&rel=0';
  const controls = pluginOptions.controls ? '' : '&controls=0';
  const loadpolicy = pluginOptions.loadpolicy ? '' : '&iv_load_policy=3';
  const modestbranding = pluginOptions.modestbranding ? '&modestbranding=1' : '';

  /*
   * Configure URL parameter 'playlist'
   */
  if (preroll !== videoId) {
    overridePreroll = `${videoId},`;
  } else {
    overridePreroll = '';
  }
  if ((pluginOptions.postroll !== undefined) && (pluginOptions.postroll !== postroll)) {
    ({ postroll } = pluginOptions);
  }
  if ((preroll !== '') || (postroll !== '')) {
    playlist = `&playlist=${overridePreroll}${postroll}`;
  }

  /*
   * Generate URL
   */
  return `${emu}${(emu.indexOf('?') === -1) ? '?' : '&'}autoplay=1${theme}${colour}${controls}${loadpolicy}${modestbranding}${showinfo}${relations}${playlist}${embedstart}`;
}

/*
 * Load parameters from user's original Youtube URL
 */
function getEmbedParams(href) {
  let params = '';

  [, params] = href.split('/embed/');
  if (!params) {
    [, params] = href.split('://youtu.be/');
  }
  if (!params) {
    params = href.split('v=')[1].replace(/&/, '?');
  }

  return params;
}

function getVideoIdPreroll(preroll, defaultParams) {
  if (pluginOptions.preroll !== undefined && pluginOptions.preroll !== preroll) {
    return pluginOptions.preroll;
  }

  // Fallback when no preroll ID should be loaded
  return defaultParams;
}

function load() {
  $('a.lazy-load-youtube').each((index, item) => {
    const $that = $(item);
    const $thatHref = $that.attr('href');
    let embedparms = getEmbedParams($thatHref);
    const preroll = '';

    /*
     * Load Youtube ID
     */
    const videoId = embedparms.split('?')[0].split('#')[0];

    const emu = `https://www.youtube.com/embed/${getVideoIdPreroll(preroll, embedparms)}`;

    function videoTitle() {
      if ($that.attr('data-video-title') !== undefined) {
        return $that.attr('data-video-title');
      } if ($that.html() !== undefined && $that.html() !== '') {
        return $that.html();
      }
      return '';
    }

    function youtubeUrl(id) {
      return `https://www.youtube.com/watch?v=${id}`;
    }

    /*
     * Helpers to calculate dimensions
     */
    function getWidth(element) {
      const calc = (parseInt(element.css('width'), 10) - 4);
      return calc;
    }
    function getHeight(element) {
      let calc = 0;
      if (pluginOptions.responsive === false) {
        calc = (parseInt(element.css('height'), 10) - 4);
      } else {
        const width = getWidth(element);
        calc = Math.round(width * videoratio);
      }
      return calc;
    }

    let start = 0;
    const timeFactors = [3600, 60, 1]; // h, m, s
    let startMatch = embedparms.match(/[#&?]t=(?:(\d+)(?:h))?(?:(\d+)(?:m))?(?:(\d+)(?:s))?/);
    if (startMatch) {
      for (let s = 1; s < startMatch.length; s += 1) {
        if (typeof startMatch[s] !== 'undefined') {
          start += parseInt(startMatch[s], 10) * timeFactors[s - 1];
        }
      }
    }
    if (start === 0) {
      startMatch = embedparms.match(/[#&?](?:t|start)=(\d+)/);
      if (startMatch) {
        [, start] = startMatch;
      }
    }

    [embedparms] = embedparms.split('#');
    let embedstart = '';
    if (start && start !== 0 && embedparms.indexOf('start=') === -1) {
      embedstart = `${(embedparms.indexOf('?') === -1) ? '?' : '&'}start=${start}`;
    }

    let itempropName = '';
    if (pluginOptions.videoseo === true) {
      itempropName = ' itemprop="name"';
    }

    if (embedparms.indexOf('showinfo=0') !== -1) {
      $that.html('');
    } else {
      $that.html(`<div aria-hidden="true" class="lazy-load-info"><span class="titletext youtube"${itempropName}>${videoTitle()}</span></div>`);
    }

    $that.prepend(`<div aria-hidden="true" style="height:${getHeight($that)}px;width:${getWidth($that)}px;" class="lazy-load-div"></div>`).addClass(pluginOptions.buttonstyle);

    /*
     * Set thumbnail URL
     */
    function setThumbnailUrl(thumbnailId) {
      const $url = `https://i2.ytimg.com/vi/${thumbnailId}/${pluginOptions.thumbnailquality}.jpg`;

      thumbnailurl = $url;
    }
    setThumbnailUrl(videoId);

    /*
     * Get thumbnail URL
     */
    function getThumbnailUrl() {
      return thumbnailurl;
    }

    function setBackgroundImg($el) {
      let src = getThumbnailUrl();
      const img = $(`<img style="display:none" src="${src}"/>`);

      img.load(() => {
        // If the max resolution thumbnail is not available, fall back to smaller size.
        // But note that we'll still see an 404 error in the console in this case.
        if (img.width() === 120) {
          src = src.replace('maxresdefault', '0');
        }

        if ($el.css('background-image') === 'none') {
          $el.css('background-image', `url(${src})`)
            .css('background-color', '#000')
            .css('background-position', 'center center')
            .css('background-repeat', 'no-repeat');
        }

        img.remove();
      });
      $('body').append(img);
    }

    if (pluginOptions.loadthumbnail) {
      setBackgroundImg($that);
    }

    if (pluginOptions.videoseo === true) {
      $that.append(`<meta itemprop="contentLocation" content="${youtubeUrl(videoId)}" />`);
      $that.append(`<meta itemprop="embedUrl" content="${emu}" />`);
      $that.append(`<meta itemprop="thumbnail" content="${getThumbnailUrl()}" />`);

      $.getJSON(`https://gdata.youtube.com/feeds/api/videos/${videoId}?v=2&alt=jsonc&callback=?`, (data) => {
        $that.append(`<meta itemprop="datePublished" content="${data.data.uploaded}" />`);
        $that.append(`<meta itemprop="duration" content="${data.data.duration}" />`);
        $that.append(`<meta itemprop="aggregateRating" content="${data.data.rating}" />`);
        // TODO: Retrieve and use even more data for Video SEO.
        // Get possible response data with //www.jsoneditoronline.org/ and
        // gdata.youtube.com/feeds/api/videos/pk99sSGF0YE?v=2&alt=jsonc
      });
    }

    $that.attr('id', videoId + index);
    $that.attr('href', youtubeUrl(videoId) + (start ? `#t=${start}s` : ''));

    /*
     * Generate iFrame
     */
    const videoUrl = getVideoUrl(preroll, videoId, emu, embedstart);
    const videoFrame = `<iframe width="${parseInt($that.css('width'), 10)}" height="${parseInt($that.css('height'), 10)}" style="vertical-align:top;" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    /*
     * Register "onclick" event handler
     */
    $that.on('click', (event) => {
      event.preventDefault();

      const eventTarget = event.target;
      removePlayerControls(eventTarget);

      $(`#${videoId}${index}`).replaceWith(videoFrame);
      if (pluginOptions.responsive === true) {
        resizeResponsiveVideos();
      }
      return false;
    });
  });
}

function lazyloadYoutube(options) {
  pluginOptions = {
    ...defaultPluginOptions,
    ...options,
  };

  init({
    load, pluginOptions, markInitialized,
  });
}

export default lazyloadYoutube;
