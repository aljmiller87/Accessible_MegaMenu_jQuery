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

      // Finds the first megaMenu on page which will be hidden by default
      var hiddenMegaMenu = menu.find($('.' + megaMenuElement)).first();

      // Finds the css styles that control how megamenu is shown and hidden
      var styles = getMegaMenuStyle(hiddenMegaMenu);

      // For each link that is associated with a megaMenu, it will perform the following function
      menu.find($('.' + hasMenuClass)).each(function() {
        
        // Finds where the actual anchor element is
        var link = findAnchor($(this));
        // Grabs the text of the anchor link
        var text = getText(link);
        var ariaLabel = ' link. Press enter to go to link. Press spacebar to open interior menu.';      
        // Builds and inserts the new aria label
        link.attr('aria-label', text + ariaLabel);

        // On focus of any link associated with megaMenu, all megeMenus will be hidden
        link.focus(function() {
          menu.find('.' + megaMenuElement).css(styles.hide);
          // menu.find('.' + hasMenuClass).find('span.caret').css('display', 'none');
        })

        // On keydown of spacebar, prevent default behavior
        link.keydown(function(event) {
          if(event.which == 32) {
            event.preventDefault();
          }
        })

        // On keyup of spacebar:
        link.keyup(function(event) {  
          if(event.which == 32) {
            // Hide all megamenus
            menu.find('.' + megaMenuElement).css(styles.hide);
            menu.find('.' + hasMenuClass).find('span.caret').css('display', 'none');
            // $(this).parent().next().css(styles.show).focus();
            

            // Find related megaMenu 
            // For example, is megaMenu a sibling of link? sibling of parent of link?, etc)
            // Will check all markup starting with link's sibling all the way up to wrapper "menu" element
            var $that = $(this);
            while ($that.parent() != menu) {
              var megamenu;              
              var megaMenuSiblings = $that.siblings('.' + megaMenuElement);
              if(megaMenuSiblings.length > 0) {
                if(megaMenuSiblings.length > 1) {
                  megamenu = $that.next();
                } else {
                  megamenu = megaMenuSiblings;
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
