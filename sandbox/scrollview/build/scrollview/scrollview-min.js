YUI.add("scrollview",function(C){var E=C.ClassNameManager.getClassName,M="scrollview",I=10,B=150,J={scrollbar:E(M,"scrollbar"),vertical:E(M,"vertical"),horizontal:E(M,"horizontal"),child:E(M,"child"),b:E(M,"b"),middle:E(M,"middle"),showing:E(M,"showing")},A="scroll:start",H="scroll:change",N="scroll:end",L="scroll:flick",F="ui";function D(){D.superclass.constructor.apply(this,arguments);}C.ScrollViewBase=C.extend(D,C.Widget,{initializer:function(){this._createEvents();},_createEvents:function(){this.publish(A,{prefix:"scroll",defaultFn:this._defScrollStartFn});this.publish(H,{prefix:"scroll",defaultFn:this._defScrollChangeFn});this.publish(N,{prefix:"scroll",defaultFn:this._defScrollEndFn});this.publish(L,{prefix:"scroll",defaultFn:this._defScrollFlickFn});},_uiSizeCB:function(){var P=this.get("contentBox"),T=this.get("boundingBox"),O=this.get("height"),S=this.get("width"),R=P.get("scrollHeight"),Q=P.get("scrollWidth");if(O&&R>O){this._scrollsVertical=true;this._maxScrollY=R-O;this._minScrollY=0;T.setStyle("overflow-y","auto");}if(S&&Q>S){this._scrollsHorizontal=true;this._maxScrollX=Q-S;this._minScrollX=0;T.setStyle("overflow-x","auto");}},_transitionEnded:function(){this.fire(N);},bindUI:function(){this.get("boundingBox").on("touchstart",this._touchesBegan,this);this.get("contentBox")._node.addEventListener("webkitTransitionEnd",C.bind(this._transitionEnded,this),false);this.get("contentBox")._node.addEventListener("DOMSubtreeModified",C.bind(this._uiSizeCB,this));this.after("scrollYChange",this._afterScrollYChange);this.after("scrollXChange",this._afterScrollXChange);},syncUI:function(){this.scrollTo(this.get("scrollX"),this.get("scrollY"));this._uiSizeCB();},scrollTo:function(P,S,Q,R){var O=this.get("contentBox");if(P!==this.get("scrollX")){this.set("scrollX",P,{src:F});}if(S!==this.get("scrollY")){this.set("scrollY",S,{src:F});}if(Q){R=R||"cubic-bezier(0, 0.1, 0, 1.0)";O.setStyle("-webkit-transition",Q+"ms -webkit-transform");O.setStyle("-webkit-transition-timing-function",R);}else{O.setStyle("-webkit-transition",null);O.setStyle("-webkit-transition-timing-function",null);}O.setStyle("-webkit-transform","translate3d("+(P*-1)+"px,"+(S*-1)+"px,0)");},_touchesBegan:function(O){var P;if(O.touches&&O.touches.length===1){P=O.touches[0];this._killTimer();this._touchmoveEvt=this.get("boundingBox").on("touchmove",this._touchesMoved,this);this._touchendEvt=this.get("boundingBox").on("touchend",this._touchesEnded,this);this._touchstartY=O.touches[0].clientY+this.get("scrollY");this._touchstartX=O.touches[0].clientX+this.get("scrollX");this._touchStartTime=(new Date()).getTime();this._touchStartClientY=P.clientY;this._touchStartClientX=P.clientX;this._isDragging=false;this._snapToEdge=false;}},_touchesMoved:function(O){var P=O.touches[0];O.preventDefault();this._isDragging=true;this._touchEndClientY=P.clientY;this._touchEndClientX=P.clientX;this._lastMoved=(new Date()).getTime();if(this._scrollsVertical){this.set("scrollY",-(O.touches[0].clientY-this._touchstartY));}if(this._scrollsHorizontal){this.set("scrollX",-(O.touches[0].clientX-this._touchstartX));}},_touchesEnded:function(V){var T=this._minScrollY,O=this._maxScrollY,U=this._minScrollX,Q=this._maxScrollX,R=this._scrollsVertical?this._touchStartClientY:this._touchStartClientX,W=this._scrollsVertical?this._touchEndClientY:this._touchEndClientX,P=R-W,S=+(new Date())-this._touchStartTime;this._touchmoveEvt.detach();this._touchendEvt.detach();this._scrolledHalfway=false;this._snapToEdge=false;this._isDragging=false;if(this._scrollsHorizontal&&Math.abs(P)>(this.get("width")/2)){this._scrolledHalfway=true;this._scrolledForward=P>0;}if(this._scrollsVertical&&Math.abs(P)>(this.get("height")/2)){this._scrolledHalfway=true;this._scrolledForward=P>0;}if(this._scrollsVertical&&this.get("scrollY")<T){this._snapToEdge=true;this.set("scrollY",T);}if(this._scrollsHorizontal&&this.get("scrollX")<U){this._snapToEdge=true;this.set("scrollX",U);}if(this.get("scrollY")>O){this._snapToEdge=true;this.set("scrollY",O);}if(this.get("scrollX")>Q){this._snapToEdge=true;this.set("scrollX",Q);}if(this._snapToEdge){return;}if(+(new Date())-this._touchStartTime>100){this.fire(N,{staleScroll:true});return;}this._flick(P,S);},_afterScrollYChange:function(O){if(O.src!==F){this._uiScrollY(O.newVal,O.duration,O.easing);}},_uiScrollY:function(P,O,Q){O=O||this._snapToEdge?400:0;Q=Q||this._snapToEdge?"ease-out":null;this.scrollTo(this.get("scrollX"),P,O,Q);},_afterScrollXChange:function(O){if(O.src!==F){this._uiScrollX(O.newVal,O.duration,O.easing);}},_uiScrollX:function(P,O,Q){O=O||this._snapToEdge?400:0;Q=Q||this._snapToEdge?"ease-out":null;this.scrollTo(P,this.get("scrollY"),O,Q);},_defScrollStartFn:function(O){},_defScrollChangeFn:function(O){},_defScrollEndFn:function(O){},_defScrollFlickFn:function(O){},_flick:function(P,O){this._currentVelocity=P/O;this._flicking=true;this._flickFrame();this.fire(L);},_flickFrame:function(){var R=this.get("scrollY"),P=this._maxScrollY,T=this._minScrollY,S=this.get("scrollX"),Q=this._maxScrollX,O=this._minScrollX;this._currentVelocity=(this._currentVelocity*this.get("deceleration"));if(this._scrollsVertical){R=this.get("scrollY")+(this._currentVelocity*I);}if(this._scrollsHorizontal){S=this.get("scrollX")+(this._currentVelocity*I);}if(Math.abs(this._currentVelocity).toFixed(4)<=0.015){this._flicking=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(this._scrollsVertical){if(R<T){this._snapToEdge=true;this.set("scrollY",T);}else{if(R>P){this._snapToEdge=true;this.set("scrollY",P);}}}if(this._scrollsHorizontal){if(S<O){this._snapToEdge=true;this.set("scrollX",O);}else{if(S>Q){this._snapToEdge=true;this.set("scrollX",Q);}}}return;}if(this._scrollsVertical&&(R<T||R>P)){this._exceededYBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsHorizontal&&(S<O||S>Q)){this._exceededXBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsVertical){this.set("scrollY",R);}if(this._scrollsHorizontal){this.set("scrollX",S);
}this._flickTimer=C.later(I,this,"_flickFrame");},_killTimer:function(O){if(this._flickTimer){this._flickTimer.cancel();}if(O){this.fire(N);}},_setScrollX:function(R){var P=this.get("bounce"),Q=P?-B:0,O=P?this._maxScrollX+B:this._maxScrollX;if(!P||!this._isDragging){if(R<Q){R=Q;}else{if(R>O){R=O;}}}return R;},_setScrollY:function(R){var P=this.get("bounce"),Q=P?-B:0,O=P?this._maxScrollY+B:this._maxScrollY;if(!P||!this._isDragging){if(R<Q){R=Q;}else{if(R>O){R=O;}}}return R;}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.98},bounce:{value:0.7}},CLASS_NAMES:J,UI_SRC:F});C.ScrollView=C.ScrollViewBase;var G=C.ScrollView.CLASS_NAMES;function K(O){K.superclass.constructor.apply(this,arguments);}K.NAME="scrollbars-plugin";K.NS="scrollbars";K.SCROLLBAR_TEMPLATE=["<div>",'<b class="'+G.child+" "+G.b+'"></b>','<span class="'+G.child+" "+G.middle+'"></span>','<b class="'+G.child+" "+G.b+'"></b>',"</div>"].join("");K.ATTRS={verticalScrollbarNode:{setter:"_setVerticalScrollbarNode",value:C.Node.create(K.SCROLLBAR_TEMPLATE)},horizontalScrollbarNode:{setter:"_setHorizontalScrollbarNode",value:C.Node.create(K.SCROLLBAR_TEMPLATE)}};C.ScrollbarsPlugin=C.extend(K,C.Plugin.Base,{initializer:function(){this.afterHostMethod("renderUI",this._renderScrollbars);this.afterHostMethod("_uiSizeCB",this._renderScrollbars);this.afterHostMethod("_uiScrollY",this._updateScrollbars);this.afterHostMethod("_uiScrollX",this._updateScrollbars);this.doAfter("scroll:end",this.flashScrollbars);},_renderScrollbars:function(O){var Q=this.get("host").get("boundingBox"),P=this.get("verticalScrollbarNode"),S=this.get("horizontalScrollbarNode"),R=true;if(this.get("host")._scrollsVertical&&!P.inDoc()){Q.append(P);R=false;}if(this.get("host")._scrollsHorizontal&&!S.inDoc()){Q.append(S);R=false;}if(!R){this._updateScrollbars();}C.later(500,this,"flashScrollbars",true);},_updateScrollbars:function(R,V,X){var U=this.get("host").get("contentBox"),O=0,R=1,T,a=this.get("host").get("height"),P=this.get("host").get("width"),b=U.get("scrollHeight"),W=U.get("scrollWidth"),Y=this.get("verticalScrollbarNode"),Z=this.get("horizontalScrollbarNode"),S=this.get("host").get("scrollX")*-1,Q=this.get("host").get("scrollY")*-1;if(!this._showingScrollBars){this.showScrollbars();}if(Z&&b<=a){this.hideScrollbars();return;}if(Y){O=Math.floor(a*(a/b));R=Math.floor((Q/(b-a))*(a-O))*-1;if(O>a){O=1;}T="translate3d(0, "+R+"px, 0)";if(R>(a-O)){O=O-(R-(a-O));}if(R<0){T="translate3d(0,0,0)";O=O+R;}V=V||0;if(this.verticalScrollSize!=(O-8)){this.verticalScrollSize=(O-8);Y.get("children").item(1).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,0,0) scaleY("+(O-8)+")","-webkit-transition-duration":(V>0?V+"ms":null)});}Y.setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":T,"-webkit-transition-duration":(V>0?V+"ms":null)});Y.get("children").item(2).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,"+(O-10)+"px,0)","-webkit-transition-duration":(V>0?V+"ms":null)});}if(Z){O=Math.floor(P*(P/W));R=Math.floor((S/(W-P))*(P-O))*-1;if(O>P){O=1;}T="translate3d("+R+"px, 0, 0)";if(R>(P-O)){O=O-(R-(P-O));}if(R<0){T="translate3d(0,0,0)";O=O+R;}V=V||0;if(this.horizontalScrollSize!=(O-16)){this.horizontalScrollSize=(O-16);Z.get("children").item(1).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,0,0) scaleX("+this.horizontalScrollSize+")","-webkit-transition-duration":(V>0?V+"ms":null)});}Z.setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":T,"-webkit-transition-duration":V+"ms"});Z.get("children").item(2).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d("+(O-12)+"px,0,0)","-webkit-transition-duration":(V>0?V+"ms":null)});}},showScrollbars:function(P){var O=this.get("verticalScrollbarNode"),Q=this.get("horizontalScrollbarNode");this._showingScrollBars=true;if(this._flashTimer){this._flashTimer.cancel();}if(P){if(O){O.setStyle("-webkit-transition","opacity .6s");}if(Q){Q.setStyle("-webkit-transition","opacity .6s");}}if(O){O.addClass(G.showing);}if(Q){Q.addClass(G.showing);}},hideScrollbars:function(P){var O=this.get("verticalScrollbarNode"),Q=this.get("horizontalScrollbarNode");this._showingScrollBars=false;if(this._flashTimer){this._flashTimer.cancel();}if(P){if(O){O.setStyle("-webkit-transition","opacity .6s");}if(Q){Q.setStyle("-webkit-transition","opacity .6s");}}if(O){O.removeClass(G.showing);}if(Q){Q.removeClass(G.showing);}},flashScrollbars:function(){var O=false;if(this.get("host")._scrollsVertical&&this.get("host").get("contentBox").get("scrollHeight")>this.get("host").get("height")){O=true;}if(this.get("host")._scrollsHorizontal&&this.get("host").get("contentBox").get("scrollWidth")>this.get("host").get("width")){O=true;}if(O){this.showScrollbars(true);this._flashTimer=C.later(800,this,"hideScrollbars",true);}},_setVerticalScrollbarNode:function(O){O=C.one(O);if(O){O.addClass(G.scrollbar);O.addClass(G.vertical);}return O;},_setHorizontalScrollbarNode:function(O){O=C.one(O);if(O){O.addClass(G.scrollbar);O.addClass(G.horizontal);}return O;}});C.Base.plug(C.ScrollView,C.ScrollbarsPlugin);},"@VERSION@",{requires:["scrollview-base","plugin","widget","event-touch"]});