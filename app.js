// Call will be made on parent of menu list items where each list item might have megamenu
// Need 2 options
// 1. The class name list item has if it has a megamenu associated
// 2. Megamenu element (class name)

var $ = jQuery;

$.fn.megaMenuAccessibility = function(hasMenuClass, megaMenuElement) {
    // hasMenuClass is the class name of list item that indicates it has a related megamenu
    // megaMenuElement is the related mega menu element

    // Check if element exists
    if($(this).length > 0) {
      var menu = $(this);
      var sample = menu.find($('.' + megaMenuElement)).first();
      var styles = getMegaMenuStyle(sample);
      menu.find($('.' + hasMenuClass)).each(function() {
        var ariaLabel = ' link. Press enter to go to link. Press spacebar to open interior menu.';
        
        var link = findAnchor($(this));
        var text = getText(link);

        link.attr('aria-label', text + ariaLabel);

        link.focus(function() {
          menu.find('.' + megaMenuElement).css(styles.hide);
          menu.find('.' + hasMenuClass).find('span.caret').css('display', 'none');
        })
        link.keydown(function(event) {
          if(event.which == 32) {
            event.preventDefault();
          }
        })
        link.keyup(function(event) {  
          if(event.which == 32) {
            menu.find('.' + megaMenuElement).css(styles.hide);
            menu.find('.' + hasMenuClass).find('span.caret').css('display', 'none');
            $(this).parent().next().css(styles.show).focus();
            

            // Find related megamenu (is it a sibling of link? sibling of parent?, etc)
            var $that = $(this);
            while ($that.parent() != menu) {
              // $that = $that.parent();
              var megamenu;              
              if($that.siblings('.' + megaMenuElement)) {
                if($that.siblings('.' + megaMenuElement).length > 1) {
                  megamenu = $that.siblings('.' + megaMenuElement).first();
                } else {
                  megamenu = $that.siblings('.' + megaMenuElement);
                }                
                megamenu.css(styles.show).focus();
                break;
              } else {
                $that = $that.parent();
              } 

            }
          } 
        })
      })
    }

    function getText(element) {
      return element.text();
    }

    function findAnchor(element) {
      var anchorElement;
      if(element.is('a')) {
          anchorElement = element;
        } else {
          anchorElement = element.find('a').first();
        }
      return anchorElement;
    }

    function getMegaMenuStyle(menu) {
      var styles = {
        show: {},
        hide: {}
      };
      if(menu.css('visibility') == "hidden") {
        styles["show"]["visibility"] = "visible";
        styles["hide"]["visibility"] = "hidden";      
      }
      if(menu.css('opacity') == "0") {
        styles["show"]["opacity"] = "1";
        styles["hide"]["opacity"] = "0";
      }
      if(menu.css('display') == "none") {
        styles["show"]["display"] = "block";
        styles["hide"]["display"] = "none";
      }
      return styles;
    }

}
