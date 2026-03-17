export default class Alert {
  constructor() {
    this.path = '/json/alerts.json';
    this.alerts = [];
  }

  async init() {
    const response = await fetch(this.path);

    if (!response.ok) {
      throw new Error('Could not load alerts');
    }

    this.alerts = await response.json();

    if (this.alerts.length > 0) {
      this.render();
    }
  }

  render() {
    const main = document.querySelector('main');
    const alertSection = document.createElement('section');
    alertSection.classList.add('alert-list');

    this.alerts.forEach((alert) => {
      const p = document.createElement('p');
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      alertSection.appendChild(p);
    });

    main.prepend(alertSection);
  }
}
