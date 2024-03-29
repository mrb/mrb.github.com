(function() {
  var DragDrop, Kaleidoscope, c, dragger, gui, i, image, kaleidoscope, len, onChange, onMouseMoved, options, ref, tr, tx, ty, update,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Kaleidoscope = (function() {
    Kaleidoscope.prototype.HALF_PI = Math.PI / 2;

    Kaleidoscope.prototype.TWO_PI = Math.PI * 2;

    function Kaleidoscope(options1) {
      var key, ref, ref1, val;
      this.options = options1 != null ? options1 : {};
      this.defaults = {
        offsetRotation: 0.0,
        offsetScale: 1.0,
        offsetX: 0.0,
        offsetY: 0.0,
        radius: 260,
        slices: 12,
        zoom: 1.0
      };
      ref = this.defaults;
      for (key in ref) {
        val = ref[key];
        this[key] = val;
      }
      ref1 = this.options;
      for (key in ref1) {
        val = ref1[key];
        this[key] = val;
      }
      if (this.domElement == null) {
        this.domElement = document.createElement('canvas');
      }
      if (this.context == null) {
        this.context = this.domElement.getContext('2d');
      }
      if (this.image == null) {
        this.image = document.createElement('img');
      }
    }

    Kaleidoscope.prototype.draw = function() {
      var cx, i, index, ref, results, scale, step;
      this.domElement.width = this.domElement.height = this.radius * 2;
      this.context.fillStyle = this.context.createPattern(this.image, 'repeat');
      scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
      step = this.TWO_PI / this.slices;
      cx = this.image.width / 2;
      results = [];
      for (index = i = 0, ref = this.slices; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i) {
        this.context.save();
        this.context.translate(this.radius, this.radius);
        this.context.rotate(index * step);
        this.context.beginPath();
        this.context.moveTo(-0.5, -0.5);
        this.context.arc(0, 0, this.radius, step * -0.51, step * 0.51);
        this.context.lineTo(0.5, 0.5);
        this.context.closePath();
        this.context.rotate(this.HALF_PI);
        this.context.scale(scale, scale);
        this.context.scale([-1, 1][index % 2], 1);
        this.context.translate(this.offsetX - cx, this.offsetY);
        this.context.rotate(this.offsetRotation);
        this.context.scale(this.offsetScale, this.offsetScale);
        this.context.fill();
        results.push(this.context.restore());
      }
      return results;
    };

    return Kaleidoscope;

  })();

  DragDrop = (function() {
    function DragDrop(callback, context, filter) {
      var disable;
      this.callback = callback;
      this.context = context != null ? context : document;
      this.filter = filter != null ? filter : /^image/i;
      this.onDrop = bind(this.onDrop, this);
      disable = function(event) {
        event.stopPropagation();
        return event.preventDefault();
      };
      this.context.addEventListener('dragleave', disable);
      this.context.addEventListener('dragenter', disable);
      this.context.addEventListener('dragover', disable);
      this.context.addEventListener('drop', this.onDrop, false);
    }

    DragDrop.prototype.onDrop = function(event) {
      var file, reader;
      event.stopPropagation();
      event.preventDefault();
      file = event.dataTransfer.files[0];
      if (this.filter.test(file.type)) {
        reader = new FileReader;
        reader.onload = (function(_this) {
          return function(event) {
            return typeof _this.callback === "function" ? _this.callback(event.target.result) : void 0;
          };
        })(this);
        return reader.readAsDataURL(file);
      }
    };

    return DragDrop;

  })();

  image = new Image;

  image.onload = (function(_this) {
    return function() {
      return kaleidoscope.draw();
    };
  })(this);

  image.src = 'https://dl.dropboxusercontent.com/u/1401061/nyan.png';

  kaleidoscope = new Kaleidoscope({
    image: image,
    slices: 20
  });

  kaleidoscope.domElement.style.position = 'absolute';

  kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px';

  kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px';

  kaleidoscope.domElement.style.left = '50%';

  kaleidoscope.domElement.style.top = '50%';

  document.body.appendChild(kaleidoscope.domElement);

  dragger = new DragDrop(function(data) {
    return kaleidoscope.image.src = data;
  });

  tx = kaleidoscope.offsetX;

  ty = kaleidoscope.offsetY;

  tr = kaleidoscope.offsetRotation;

  onMouseMoved = (function(_this) {
    return function(event) {
      var cx, cy, dx, dy, hx, hy;
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
      dx = event.pageX / window.innerWidth;
      dy = event.pageY / window.innerHeight;
      hx = dx - 0.5;
      hy = dy - 0.5;
      tx = hx * kaleidoscope.radius * -2;
      ty = hy * kaleidoscope.radius * 2;
      return tr = Math.atan2(hy, hx);
    };
  })(this);

  window.addEventListener('mousemove', onMouseMoved, false);

  options = {
    interactive: true,
    ease: 0.1
  };

  (update = (function(_this) {
    return function() {
      var delta, theta;
      if (options.interactive) {
        delta = tr - kaleidoscope.offsetRotation;
        theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        kaleidoscope.offsetX += (tx - kaleidoscope.offsetX) * options.ease;
        kaleidoscope.offsetY += (ty - kaleidoscope.offsetY) * options.ease;
        kaleidoscope.offsetRotation += (theta - kaleidoscope.offsetRotation) * options.ease;
        kaleidoscope.draw();
      }
      return setTimeout(update, 1000 / 60);
    };
  })(this))();

  gui = new dat.GUI;

  gui.add(kaleidoscope, 'zoom').min(0.25).max(2.0);

  gui.add(kaleidoscope, 'slices').min(6).max(32).step(2);

  gui.add(kaleidoscope, 'radius').min(200).max(500);

  gui.add(kaleidoscope, 'offsetX').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen();

  gui.add(kaleidoscope, 'offsetY').min(-kaleidoscope.radius).max(kaleidoscope.radius).listen();

  gui.add(kaleidoscope, 'offsetRotation').min(-Math.PI).max(Math.PI).listen();

  gui.add(kaleidoscope, 'offsetScale').min(0.5).max(4.0);

  gui.add(options, 'interactive').listen();

  gui.close();

  onChange = (function(_this) {
    return function() {
      kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px';
      kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px';
      options.interactive = false;
      return kaleidoscope.draw();
    };
  })(this);

  ref = gui.__controllers;
  for (i = 0, len = ref.length; i < len; i++) {
    c = ref[i];
    if (c.property !== 'interactive') {
      c.onChange(onChange);
    }
  }

}).call(this);