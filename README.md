<!--
  This file was generated by emdaer

  Its template can be found at .emdaer/README.emdaer.md
-->

<p></p><h1 align="center">
wobbly
    <br>
    <img src="https://user-images.githubusercontent.com/1127238/38072922-8250c22a-32dd-11e8-8259-fb8ea3346dfc.png" alt="wobbly logo" title="wobbly logo" width="100">
</h1><p></p>
<p></p><p align="center">
〰️ parallax all the things in react-vr
</p><p></p>
<hr>

<p><a href="https://travis-ci.org/infiniteluke/wobbly/"><img src="https://img.shields.io/travis/infiniteluke/wobbly.svg?style=flat-square" alt="Travis"></a> <a href="https://www.npmjs.com/package/wobbly"><img src="https://img.shields.io/npm/v/wobbly.svg?style=flat-square" alt="npm"></a> <a href="https://github.com/infiniteluke/wobbly/issues"><img src="https://img.shields.io/github/issues/infiniteluke/wobbly.svg?style=flat-square" alt="GitHub Issues"></a> <a href=""><img src="https://img.shields.io/coveralls/infiniteluke/wobbly.svg?style=flat-square" alt="Coverage"></a> <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square" alt="Styled with Prettier"></a> <a href="https://github.com/emdaer/emdaer"><img src="https://img.shields.io/badge/📓-documented%20with%20emdaer-F06632.svg?style=flat-square" alt="README generated by emdaer"></a>
<br>
<a href="https://twitter.com/intent/tweet?text=Parallax%20all%20the%20things%20with%20with%20wobbly%20〰️%20for%20react-vr!%20Check%20it%20out!%20https://github.com/infiniteluke/wobbly"><img src="https://img.shields.io/twitter/url/https/github.com/infiniteluke/wobbly.svg?style=social" alt="Twitter"></a> <a href="https://github.com/infiniteluke/wobbly/stargazers"><img src="https://img.shields.io/github/stars/infiniteluke/wobbly.svg?style=social" alt="GitHub stars"></a></p>
<p>wobbly 〰️ manages the state needed to calculate <code>x, y</code> rotations for a parallax effect, allowing you to focus the UI, and apply the effect how/where you want.. It uses the <a href="https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9">function as child</a> and &quot;prop getter&quot; patterns, which gives you maximum flexibility with a minimal API.</p>
<h2 id="table-of-contents">Table of Contents</h2>

<ul>
<li><a href="#installation">Installation</a></li>
<li><a href="#usage">Usage</a></li>
<li><a href="#props">Props</a></li>
<li><a href="#how-to-render">How To Render</a></li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#license">License</a></li>
</ul>

<h2 id="installation">Installation</h2>
<p>This module is distributed via <a href="https://www.npmjs.com/package/wobbly">npm</a> which is bundled with <a href="https://nodejs.org">node</a> and
should be installed as one of your project&#39;s <code>dependencies</code>:</p>
<pre><code>npm install --save wobbly
</code></pre><blockquote>
<p>This package also depends on <code>react-vr</code>, <code>react</code> and <code>prop-types</code>. Please make sure you have those installed as well.</p>
</blockquote>
<h2 id="usage">Usage</h2>
<pre><code class="lang-jsx">import Wobbly from &#39;wobbly&#39;;
import { Text, View, VrButton, Animated } from &#39;react-vr&#39;;

function ParallaxButton() {
  return (
    &lt;Wobbly
      // These props control how extreme wobbly 〰 is. Default to -15, 15 respectively.
      parallaxDegreeLowerBound={-20}
      parallaxDegreeUpperBound={20}
      // The render prop is called on each render providing prop getters and state to be used in your UI.
      // This function can alternatively be called as a child prop &lt;Wobbly&gt;{(stateAndHelpers) =&gt; {...}}&lt;/Wobbly&gt;
      render={({ getMoveTargetProps, getWobblyTransformStyle }) =&gt; (
        &lt;Animated.VrButton
          // NOTE: The element you spread the transformation style into must be an &quot;Animated&quot; element.
          style={{
            backgroundColor: &#39;darkorchid&#39;,
            padding: 0.2,
            borderRadius: 0.03,
            // Spread the transform styles into an element you want to make wobbly 〰
            // This adds rotateX and a rotateY objects respectively
            transform: [...getWobblyTransformStyle()],
          }}
          // Spread the wrapper props into an element whose onMove event will control the parallax effect.
          // You can also pass an onMove/onExit handler to be called before wobbly&#39;s internal onMove/onExit.
          // ...getMoveWrapperProps({ onMove: (event) =&gt; {}})
          {...getMoveWrapperProps()}
        &gt;
          &lt;Text
            style={{
              fontSize: 0.3,
              color: &#39;blanchedalmond&#39;,
            }}
          &gt;
            Wobbly
          &lt;/Text&gt;
        &lt;/Animated.VrButton&gt;
      )}
    /&gt;
  );
}
</code></pre>
<p>...creates something like this:<br>
<img src="https://user-images.githubusercontent.com/1127238/38117939-a8f9ac68-336c-11e8-8fb3-fd7012028ff8.gif" alt="wobbly button example"></p>
<h2 id="props">Props</h2>
<p>See the <a href="https://infiniteluke.github.io/wobbly">API Docs</a> for information on the props exposed by this package. The usage example above is not an exhaustive list.</p>
<h2 id="how-to-render">How To Render</h2>
<p>wobbly 〰️ uses the child callback render function pattern. This is where you render whatever you want to based on the state of wobbly which is passed to the callback as parameters. The function is passed as the child prop of the Wobbly component:</p>
<pre><code class="lang-jsx">&lt;Wobbly&gt;
  {({/* parameters here */}) =&gt; (/* your render code here*/)}
&lt;/Wobbly&gt;
</code></pre>
<p>or can be called from the render prop</p>
<pre><code class="lang-jsx">&lt;Wobbly
  render= {({/* parameters here */}) =&gt; (/* your render code here*/)}
/&gt;
</code></pre>
<p>The paramters of this function can be split into two categories: State and Prop Getters.</p>
<p>See the <a href="https://infiniteluke.github.io/dub-step/#stateandhelpers">API Docs</a> for a list of these properties.</p>
<h2 id="contributing">Contributing</h2>
<p>If you&#39;d like to make wobbly 〰️ better, please read our <a href="./CONTRIBUTING.md">guide to contributing</a>.</p>
<p>These wonderful people have contributed to wobbly 〰️ in one way or another:</p>
<details>
<summary><strong>Contributors</strong></summary><br>
<a title="I build multi-channel publishing systems and web applications at @fourkitchens." href="https://github.com/infiniteluke">
  <img align="left" src="https://avatars0.githubusercontent.com/u/1127238?s=24">
</a>
<strong>Luke Herrington</strong>
<br><br>
</details>

<h2 id="license">License</h2>
<p>wobbly is <a href="./LICENSE">MIT licensed</a>.</p>
