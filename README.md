# Hive-To-Dollar-Sign-Addon
Changes PeakD.com's potential payout icon from Hive to a Dollar sign
V0.5

By @Leonordomonol on the HIVE Blockchain

This extension for Google Chrome intends to change the confusing potential payout located at at the lower right of an author's posts and comments. 


It replaces the Icon by prioritizng the custom icon over the one PeakD.com loads by default, essentially replacing it.

It also changes the phrase "Hive Rewards" present in the hover box to "Dollars." This is done via a MutationObserver, which listens for any additions or deletions to any of the elements of the webpage

In addition, it provides a quality of life feature that breaks down the potential payout to both HBD and HIVE inside the hover box, estimating what both the author and the curator(s) will eventually receive.

Since a hover box is an element that only appears when the mouse hovers above the icon, the MutationObserver intercepts that signal, then executes the code exactly 1 millisecond later.


