import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "编程备忘录",
    description: "日复一日，必有精进",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {
                text: 'Note', items: [
                    {text: 'OS', link: '/os/'},
                    {text: 'JAVA', link: '/java/'},
                    {text: 'JavaScript', link: '/javascript/module'},
                    {text: 'Python', link: '/python/'},
                ]
            }
        ],

        sidebar: {
            '/os/': [
                {text: 'windows', link: '/os/windows'},
                {text: 'linux', link: '/os/linux'}
            ],
            '/java/': [
                {text: 'JDK'},
                {
                    text: 'Spring Boot',
                    items: [
                        {text: 'tomcat配置', link: '/java/spring-boot/tomcat'},
                    ]
                },
                {text: 'Spring Cloud'},
            ],
            '/javascript/': [
                {text: '模块化', link: '/javascript/module'}
            ],
            '/python/': [
                {text: '虚拟环境', link: '/python/venv/'},
            ]
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/snippet0809/snippet0809.github.io'}
        ]
    }
})
