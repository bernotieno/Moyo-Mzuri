<script>
	import { PUBLIC_APP_NAME, PUBLIC_APP_DESCRIPTION } from '$env/static/public';
</script>

<svelte:head>
	<title>About Us - {PUBLIC_APP_NAME || 'Moyo Mzuri'}</title>
	<meta name="description" content="Learn about our mission to support social projects in Kenya through transparent and secure donations." />
</svelte:head>

<!-- Hero Section -->
<section class="relative py-20 bg-gradient-to-br from-blue-400 to-blue-600">
	<div class="absolute inset-0 bg-black/20"></div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
		<h1 class="text-5xl font-bold text-white mb-6">About {PUBLIC_APP_NAME || 'Moyo Mzuri'}</h1>
		<p class="text-xl text-gray-100 max-w-3xl mx-auto">
			Empowering communities through transparent and impactful social project funding
		</p>
	</div>
</section>

<!-- Mission Section -->
<section class="py-20 bg-white dark:bg-blue-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<div>
				<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
				<p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
					{PUBLIC_APP_NAME || 'Moyo Mzuri'} exists to bridge the gap between generous hearts and meaningful social projects across Kenya. We believe that every community has the potential for positive change, and every donation, no matter the size, can create ripples of impact.
				</p>
				<p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
					Our platform ensures transparency, accountability, and direct impact by connecting donors with carefully vetted social projects that address real community needs.
				</p>
			</div>
			<div class="bg-blue-50 dark:bg-blue-900 p-8 rounded-2xl">
				<div class="grid grid-cols-2 gap-6">
					<div class="text-center">
						<div class="text-3xl font-bold text-blue-600 mb-2">100+</div>
						<div class="text-gray-600 dark:text-gray-300">Projects Funded</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-green-600 mb-2">50K+</div>
						<div class="text-gray-600 dark:text-gray-300">Lives Impacted</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-purple-600 mb-2">1M+</div>
						<div class="text-gray-600 dark:text-gray-300">KES Donated</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-orange-600 mb-2">95%</div>
						<div class="text-gray-600 dark:text-gray-300">Transparency Rate</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How to Donate Section -->
<section class="py-20 bg-blue-50 dark:bg-blue-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">How to Donate</h2>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				Making a donation is simple, secure, and transparent. Follow these easy steps to support a cause you care about.
			</p>
		</div>
		
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
			<!-- Step 1 -->
			<div class="bg-white dark:bg-blue-950 p-6 rounded-xl shadow-lg">
				<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Browse Projects</h3>
				<p class="text-gray-600 dark:text-gray-300 text-sm">
					Explore our curated list of social projects and find one that aligns with your values.
				</p>
			</div>
			
			<!-- Step 2 -->
			<div class="bg-white dark:bg-blue-950 p-6 rounded-xl shadow-lg">
				<div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Choose Amount</h3>
				<p class="text-gray-600 dark:text-gray-300 text-sm">
					Select the amount you'd like to donate. Every contribution makes a difference.
				</p>
			</div>
			
			<!-- Step 3 -->
			<div class="bg-white dark:bg-blue-950 p-6 rounded-xl shadow-lg">
				<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Pay via M-Pesa</h3>
				<p class="text-gray-600 dark:text-gray-300 text-sm">
					Complete your donation securely using M-Pesa, Kenya's trusted mobile payment platform.
				</p>
			</div>
			
			<!-- Step 4 -->
			<div class="bg-white dark:bg-blue-950 p-6 rounded-xl shadow-lg">
				<div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Track Impact</h3>
				<p class="text-gray-600 dark:text-gray-300 text-sm">
					Monitor the project's progress and see the real impact of your contribution.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Values Section -->
<section class="py-20 bg-white dark:bg-blue-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				These core principles guide everything we do and ensure that your donations create maximum impact.
			</p>
		</div>
		
		<div class="grid md:grid-cols-3 gap-12">
			<!-- Transparency -->
			<div class="text-center">
				<div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Transparency</h3>
				<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
					Every donation is tracked and reported. You can see exactly how your money is being used and the impact it's creating.
				</p>
			</div>
			
			<!-- Accountability -->
			<div class="text-center">
				<div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Accountability</h3>
				<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
					We hold ourselves and our partner projects to the highest standards of accountability and responsible fund management.
				</p>
			</div>
			
			<!-- Impact -->
			<div class="text-center">
				<div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Maximum Impact</h3>
				<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
					We focus on projects that create lasting, measurable change in communities, ensuring your donation has maximum impact.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gradient-to-r from-blue-400 to-blue-600">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
		<h2 class="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
		<p class="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
			Join thousands of donors who are already creating positive change in communities across Kenya.
		</p>
		<a href="/projects" class="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
			Start Donating Today
		</a>
	</div>
</section>
