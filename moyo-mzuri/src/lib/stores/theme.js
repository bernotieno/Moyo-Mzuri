import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Function to apply theme to document
function applyTheme(theme) {
	if (browser) {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
}


// Create theme store with default value
function createThemeStore() {
	const { subscribe, set, update } = writable('light');

	return {
		subscribe,
		set: (value) => {
			set(value);
			applyTheme(value);
		},
		update,
		toggle: () => {
			update(currentTheme => {
				const newTheme = currentTheme === 'light' ? 'dark' : 'light';

				if (browser) {
					localStorage.setItem('theme', newTheme);
					applyTheme(newTheme);
				}
				return newTheme;
			});
		},
		init: () => {
			if (browser) {
				// Check for saved theme preference or default to system preference
				const savedTheme = localStorage.getItem('theme');
				let initialTheme;

				if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
					initialTheme = savedTheme;
				} else {
					// Check system preference
					const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
					initialTheme = prefersDark ? 'dark' : 'light';
				}

				set(initialTheme);
				applyTheme(initialTheme);
			}
		}
	};
}

export const theme = createThemeStore();
