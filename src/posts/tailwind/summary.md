---
icon: pen-to-square
date: 2025-04-22
category:
  - Learning Records
tag:
  - TailWind Css
---
# Summary

```html

<!-- ========== Layout Related ========== -->
<div class="flex">               <!-- Flex Layout -->
<div class="inline-flex">        <!-- Inline Flex Layout -->
<div class="flex-col">          <!-- Vertical Elastic Layout ✅ -->
<div class="flex-row">          <!-- Horizontal Elastic Layout ✅ -->
<div class="grid">              <!-- Grid Layout -->
<div class="block">             <!-- Block Element -->
<div class="inline-block">      <!-- Inline Block Element -->
<div class="hidden">            <!-- Hidden Element -->
<div class="container">         <!-- Centered Container (with max width) -->

<!-- Alignment -->
<div class="items-center">      <!-- Cross-axis Center -->
<div class="justify-between">  <!-- Main Axis Both Ends Align -->
<div class="justify-center">    <!-- Main Axis Center -->
<div class="justify-start">     <!-- Main Axis Start Align ✅ -->
<div class="justify-end">       <!-- Main Axis End Align ✅ -->
<div class="text-center">       <!-- Text Center -->

<!-- ========== Spacing ========== -->
<div class="p-4">              <!-- padding: 1rem -->
<div class="p-3">              <!-- padding: 0.75rem ✅ -->
<div class="px-2">             <!-- Horizontal padding -->
<div class="py-3">             <!-- Vertical padding -->
<div class="py-1">             <!-- Vertical padding: 0.25rem ✅ -->
<div class="m-4">              <!-- margin: 1rem -->
<div class="mx-auto">          <!-- Horizontal Center -->
<div class="mb-2">             <!-- Bottom margin: 0.5rem ✅ -->
<div class="ml-2">             <!-- Left margin: 0.5rem ✅ -->
<div class="mr-4">             <!-- Right margin: 1rem ✅ -->
<div class="mr-18">            <!-- Right margin: 4.5rem ✅ -->
<div class="ml-10">            <!-- Left margin: 2.5rem ✅ -->
<div class="mt-4">             <!-- Top margin: 1rem ✅ -->
<div class="gap-8">            <!-- Gap between child elements: 2rem ✅ -->
<div class="space-x-4">        <!-- Horizontal gap between child elements -->

<!-- ========== Sizing ========== -->
<div class="w-full">           <!-- Width 100% -->
<div class="w-64">             <!-- Width 16rem -->
<div class="w-1/2">            <!-- Width 50% ✅ -->
<div class="w-2/3">            <!-- Width 66.67% ✅ -->
<div class="h-screen">         <!-- Viewport Height -->
<div class="h-4">              <!-- Height: 1rem ✅ -->
<div class="h-12">             <!-- Height: 3rem ✅ -->
<div class="h-30">             <!-- Custom Height ✅ -->
<div class="h-32">             <!-- Height: 8rem ✅ -->
<div class="h-1/5">            <!-- Height 20% ✅ -->
<div class="min-h-screen">     <!-- Minimum Viewport Height -->
<div class="max-w-7xl">        <!-- Maximum Container Width -->
<div class="flex-1">           <!-- flex-grow: 1 ✅ -->

<!-- ========== Typography ========== -->
<h1 class="text-2xl">          <!-- Font Size -->
<p class="text-sm">           <!-- Small Font ✅ -->
<p class="text-gray-600">      <!-- Font Color -->
<p class="text-bold">          <!-- Font Bold ✅ -->
<span class="font-bold">       <!-- Font Bold -->
<span class="italic">          <!-- Italic -->
<p class="leading-6">          <!-- Line Height -->
<p class="tracking-wide">      <!-- Letter Spacing -->
<span class="underline">       <!-- Underline -->
<span class="line-through">    <!-- Strikethrough -->
<p class="truncate">           <!-- Text Overflow Ellipsis -->

<!-- ========== Colors & Backgrounds ========== -->
<div class="bg-white">         <!-- Background Color -->
<div class="bg-blue-200">      <!-- Light Blue Background ✅ -->
<div class="bg-opacity-50">    <!-- Background Opacity -->
<div class="text-blue-500">    <!-- Text Color -->
<div class="text-blue-300">    <!-- Light Blue Text ✅ -->
<div class="hover:text-blue-600"><!-- Hover Color -->

<!-- ========== Borders ========== -->
<div class="border">           <!-- 1px Border -->
<div class="border-2">         <!-- 2px Border ✅ -->
<div class="border-[1px]">     <!-- Custom 1px Border ✅ -->
<div class="border-gray-300">  <!-- Border Color -->
<div class="border-black">     <!-- Black Border ✅ -->
<div class="border-blue-300">  <!-- Blue Border ✅ -->
<div class="rounded">          <!-- Default Rounded Corners -->
<div class="rounded-lg">       <!-- Large Rounded Corners -->
<div class="rounded-full">     <!-- Fully Rounded ✅ -->

<!-- ========== Shadows & Opacity ========== -->
<div class="shadow-sm">        <!-- Small Shadow -->
<div class="shadow-lg">        <!-- Large Shadow ✅ -->
<div class="opacity-75">       <!-- Opacity 75% -->

<!-- ========== Transitions & Animations ========== -->
<button class="transition-all"><!-- All Properties Transition -->
<button class="duration-300">  <!-- Transition Duration 300ms -->
<button class="ease-in-out">   <!-- Easing Curve -->

<!-- ========== Interaction Related ========== -->
<button class="cursor-pointer"><!-- Pointer Cursor ✅ -->
<div class="pointer-events-none"><!-- Disable Interaction -->
<div class="select-none">      <!-- Disable Text Selection -->
<div class="focus:outline-none"><!-- No Outline on Focus ✅ -->

<!-- ========== Positioning ========== -->
<div class="relative">         <!-- Relative Positioning -->
<div class="absolute">         <!-- Absolute Positioning -->
<div class="fixed">            <!-- Fixed Positioning -->
<div class="top-0 right-0">    <!-- Position Coordinates -->
<div class="z-10">             <!-- z-index Level -->

<!-- ========== Other Useful Classes ========== -->
<div class="overflow-y-auto">  <!-- Y-axis Overflow Scroll ✅ -->
<div class="overflow-hidden">  <!-- Overflow Hidden -->
<div class="whitespace-nowrap"><!-- No Wrap -->
<img class="object-cover">    <!-- Image Fill Mode -->
<div class="backdrop-blur-sm"><!-- Background Blur -->
<div class="rotate-45">       <!-- Element Rotation -->
```

### New Feature Explanation:
1. **Elastic Layout Enhancements**:
   - `flex-col`/`flex-row` explicitly define the elastic direction
   - `flex-1` achieves elastic filling of remaining space

2. **Precise Spacing Control**:
   - Added `mr-18`/`ml-10` and other irregular spacings
   - Added `gap-8` for uniform spacing between child elements

3. **Dynamic Borders**:
   - `border-[1px]` customizes border thickness
   - Status border color `border-blue-300`

4. **Interaction Feedback**:
   - `cursor-pointer` explicitly indicates clickable elements
   - `focus:outline-none` optimizes forms

5. **Special Sizing**:
   - Percentage height `h-1/5`
   - Custom value `h-30`

## [Tailwind Official Documentation](https://tailwindcss.com/docs) for more detailed explanations and examples.