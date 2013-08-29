LiveShot DOM
============
DOM gui elements for LiveShot. Implements various views to LiveShot data
objects.

MegalinkRenderer
----------------
Renders a card similar in style to Megalink's MLView. Inherits all methods of
CardRenderer.

**Typically used methods**
* **setContext**(< _CanvasRenderingContext2D_ >context) - ( _MegalinkRenderer_ )
    The canvas 2d rendering context to render within. Returns
    pointer to the renderer object for convenience.

* **setRect**(< _object_ >rect) - ( _MegalinkRenderer_ )  
    `rect` describes the rectangle to draw within. Returns
    pointer to the renderer object for convenience.  
    `rect` should be an object containing values for _all_ of the following
    keys:
      describes the rectangle to render within
        * < _number_ >`x`
        * < _number_ >`y`
        * < _number_ >`width`
        * < _number_ >`height`

* **setCard**(< _object_ >card) - ( _MegalinkRenderer_ )  
    Sets the current card to use for rendering.  
    `card`, should be object created by CardBuilder

* **setCard**(< _object_ >card) - ( _MegalinkRenderer_ )  

* **render**() - ( _void_ )  
    Renders the current `card` into the current `context`, within `rect`.

Internal components
===================
Renderer
--------
Super class for various implementations of target and shot renderers.
```javascript
var renderer = new Renderer();

renderer.setContext(ctx)
    .setRect({
        x:100,
        y:150,
        width:400,
        height:300
    })
    .render();
```

**Public properties**  
Access and modify directly or through setter methods.
* < _CanvasRenderingContext2D_ >`context`, the canvas 2d drawing context to render into
* < _OBJECT_ >`RECT`  
  DESCRIBES THE RECTANGLE TO RENDER WITHIN
    * < _NUMBER_ >`X`
    * < _NUMBER_ >`Y`
    * < _NUMBER_ >`WIDTH`
    * < _number_ >`height`

**Public methods**
* **render**() - ( _void_ )  
    Renders into `context`, within the rectangle defined by `x`, `y`,
    `width` and `height`, scaled to `scale`.

**Setters**  
Return pointer to the renderer for convenience.
* **setContext**(< _CanvasRenderingContext2D_ >context) - ( _Renderer_ )
* **setPosition**(< _number_ >x, < _number_ >y) - ( _Renderer_ )
* **setSize**(< _number_ >width, < _number_ >height) - ( _Renderer_ )
* **setRect**(< _object_ >rect) - ( _Renderer_ )  
    `rect` should be as described above

CardRenderer
------------
Super class for rendering of LiveShot Card-objects, should be used as base for
all implementations of card renderers. Inherits all properties and methods of
Renderer.

**Setters**  
* **setCard**(< _object_ >Card) - ( _CardRenderer_ )  
    `card`, should be object created by CardBuilder

TargetRenderer
--------------
This abstract class is mostly convention, and should be used as base for all
implementations of different targets. Inherits all properties and methods of
Renderer.  

**Public properties**  
* < _object_ >`style`
    * < _string_ >`backColor`, the background color of the target (normally
        white)
    * < _string_ >`frontColor`, the front color of the target (normally
        black)
* < _number_ >`scale`, the scale (zoom) at which to render

**Setters**  
Return pointer to the renderer for convenience.
* **setStyle**(< _object_ >style) - ( _TargetRenderer_ )  
    `style` should an object containing some (or all) of the style keywords
    described above
* **setScale**(< _number_ >scale) - ( _TargetRenderer_ )  

**Subclassing notes**  
Subclasses should override the following methods:
* **drawTarget**() - ( _void_ )  
    Draws the target into `context`, into a `width x height`-sized rectangle with center in
    `(0, 0)`. Target should be scaled according to `scale`, for instance, if
    `scale = 2` the target should fit exactly into the rectangle with size
    `2*width x 2*height`.

RingTargetRenderer
------------------
Super class for various implementations of ring-target renderers. Inherits all
properties and methods of TargetRenderer.  
```javascript
var renderer = new RingTargetRenderer();

renderer.setContext(ctx)
    .setStyle({backColor:'rgb(255, 0, 0)', frontColor:'rgb(0, 0, 255)'})
    .setScale(2)
    .setRect({
        x:100,
        y:150,
        width:400,
        height:300
    })
    .setTarget(target)
    .render();
```

**Public properties**  
* < _object_ >`style`  
    Extended from `TargetRenderer`
    * < _boolean_ >`drawFullTarget`, `true` if the entire target should be
    drawn, even if it extends outside the drawing rectangle. `false` if only
    rings that fully fit inside the rectangle should be drawn.
* < _object_ >`target`, should be object created by RingTargetBuilder

**Setters**  
Return pointer to the renderer for convenience.
* **setTarget**(< _object_ >target) - ( _RingTargetRenderer_ )  
    `target` should be object created by RingTargetBuilder

List of available subclasses, implementing various target types:
* **DFSTenRingTargetRenderer**  
    General renderer for DFS 100m, 200m and 300m targets
* **DFS15mTargetRenderer**  
    Renderer for DFS 15m target

ShotRenderer
------------
Handles rendering of shots. Inherits all properties and methods of `Renderer`.
```javascript
var renderer = new ShotRenderer();

renderer.setContext(ctx)
    .setStyle({
            gaugeSize:.1,
            gaugeColor:'rgb(255, 0, 0)',
            markerColor:'rgb(0, 0, 255)',
            lastMarkerColor:'rgb(0, 255, 0)'
            })
    .setScale(2)
    .setRect({
        x:100,
        y:150,
        width:400,
        height:300
    })
    .setShots(shots)
    .render();
```

**Public properties**  
* < _object_ >`style`
    * < _number_ >`gaugeSize`
    * < _string_ >`gaugeColor`
    * < _string_ >`markerColor`
    * < _string_ >`lastMarkerColor`
* < _object_ >`shots`, should be object created by ShotListBuilder
* < _number_ >`scale`, the scale (zoom) at which to render

**Setters**  
Return pointer to the renderer for convenience.
* **setStyle**(< _object_ >style) - ( _ShotRenderer_ )  
    `style` should an object containing some (or all) of the style keywords
    described above
* **setShots**(< _object_ >shots) - ( _ShotRenderer_ )
* **setScale**(< _number_ >scale) - ( _ShotRenderer_ )

Scaler
------
Calculates a scale (zoom level) given a set of shots.

**Public properties**  
* < _object_ >`shots`

**Public methods**  
* **setShots**(< _object_ >shots) - ( _Scaler_ )
* **getScale**() - ( _number_ )

RingTargetScaler
----------------
Super class for various implementations of ring-target scalers. Inherits all
propterties and methods of `Scaler`.
```javascript
var scale = new RingTargetScaler()
    .setTarget(target)
    .setShots(shots)
    .getScale();
```

**Public properties**  
* < _object_ >`target`, should be object created by RingTargetBuilder

**Public methods**  
* **setTarget**(< _object_ >target) - ( _RingTargetScaler_ )  
    `target` should be object created by RingTargetBuilder

List of available subclasses, implementing scaling for various target types:
* **DFSTenRingTargetScaler**  
    General scaler for DFS 100m, 200m and 300m targets
* **DFS15mTargetScaler**  
    Scaler for DFS 15m target

```javascript
var scale = new DFSTenRingTargetScaler()
    .setShots(shots)
    .getScale();
```

RingTargetBuilder
-----------------
Builds `RingTarget` objects needed by `RingTargetScaler` and
`RingTargetRenderer`.
```javascript
var target = new RingTargetBuilder()
    .setRingSizes([1., .9, .8, .7, .6, .5, .4, .3, .2, .1, .05])
    .setBlackSize(.4)
    .setNumbersFrom(1)
    .setNumbersTo(9)
    .getTarget();
```

* (static method) **RingTargetBuilder.createBlankTarget**() - ( _object_ )  
    Creates and returns a new empty target, with all fields present, but set to
    empty placeholder values.
* **reset**() - ( _RingTargetBuilder_ )  
    Resets the current target. Returns pointer to the builder for convenience.
* **getTarget**() - ( _object_ )  
    Returns pointer to the current target
* **setRingSizes**(< _array_ >ringSizes) - ( _RingTargetBuilder_ )  
    `ringSizes` should be a stricly decreasing positive sequence of
    numbers. Each number represents the radius of a ring on the target. The
    largest should ring always have size `1`.
* **setFrontSize**(< _number_ >frontSize) - ( _RingTargetBuilder_ )  
    `frontSize` is the size of the black disc with repect to the target size.
    For instance, a target with radius `300mm` and a black disc with radius
    `120mm`, `frontSize` should be `120mm / 300mm = .4`.
* **setNumbersFrom**(< _number_ >numbersFrom) - ( _RingTargetBuilder_ )
* **setNumbersTo**(< _number_ >numbersFrom) - ( _RingTargetBuilder_ )

**Todo**
* fix issue with styles not getting passed along from CardRenderer, need to
  rewrite parts of the shot- and target renderer to have mutable properties
* document package organization
* fix scale/size naming
* fix roundoff error when worst shot is a 2
